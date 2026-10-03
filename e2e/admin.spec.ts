import { expect, test, type Page } from "@playwright/test";

/*
  System/e2e checks for the admin panel, driven through the real UI against a
  real dev server and a real database. Nothing is stubbed.

  Run against a throwaway database only (see the local SQLite recipe):
    ADMIN_AUTH_BYPASS=1 on the server, E2E_BASE_URL=http://127.0.0.1:3100
    npx playwright test e2e/admin.spec.ts --project=desktop-chrome

  The login flow itself is covered by manual-qa.spec.ts; the bypass skips it.
  Cloudinary uploads need the network and a widget, so image *storage* is
  covered by the integration suites; here the image controls are only checked
  for presence.
*/

test.skip(({ isMobile }) => isMobile, "desktop-only admin flows");

// A dev server compiles each route on first visit, so post-save navigations can be slow.
const SLOW = { timeout: 90_000 };

const ADMIN_SCREENS = [
  "/admin",
  "/admin/home",
  "/admin/site-settings",
  "/admin/slider",
  "/admin/president",
  "/admin/youtube",
  "/admin/social",
  "/admin/navigation",
  "/admin/blog-posts",
  "/admin/blog-posts/new",
  "/admin/activity-posts",
  "/admin/activity-posts/new",
  "/admin/events",
  "/admin/events/new",
  "/admin/activities",
  "/admin/activities/new",
  "/admin/courses",
  "/admin/courses/new",
  "/admin/departments",
  "/admin/departments/new",
  "/admin/team-members",
  "/admin/team-members/new",
  "/admin/contact-submissions",
  "/admin/media",
];

test.describe("every admin screen renders", () => {
  for (const path of ADMIN_SCREENS) {
    test(path, async ({ page }) => {
      const problems: string[] = [];
      page.on("pageerror", (error) => problems.push(error.message));
      page.on("response", (response) => {
        if (response.url().includes("/api/admin") && response.status() >= 500) {
          problems.push(`${response.status()} ${response.url()}`);
        }
      });

      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(400);
      await expect(page.getByRole("heading").first()).toBeVisible();
      await expect(page.locator("body")).not.toContainText(/Application error|Unhandled Runtime Error/);
      expect(problems).toEqual([]);
    });
  }
});

/** Open a form page and wait until React has attached, so a click cannot fall through to a native submit. */
async function hydrated(page: Page) {
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    return !!form && Object.keys(form).some((key) => key.startsWith("__reactProps"));
  });
}

async function openForm(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await hydrated(page);
}

async function deleteDepartmentsByName(page: Page, name: string) {
  await page.evaluate(async (target) => {
    const list: { id: string; name: string }[] = await (await fetch("/api/admin/departments")).json();
    for (const department of list.filter((d) => d.name.startsWith(target))) {
      await fetch(`/api/admin/departments/${department.id}`, { method: "DELETE" });
    }
  }, name);
}

test("department editor: create, show publicly, edit, unpublish, delete", async ({ page }) => {
  const stamp = Date.now();
  const name = `E2E Birim ${stamp}`;
  const slug = `e2e-birim-${stamp}`;

  await page.goto("/admin/departments", { waitUntil: "domcontentloaded" });
  try {
    // Create with text, a member and a gallery slot.
    await openForm(page, "/admin/departments/new");
    await page.getByLabel("Birim adı").fill(name);
    await page.getByLabel("Kısa açıklama").fill("İlk özet");
    await page.locator(".w-md-editor-text-input").fill("## Hakkımızda\n\nE2E gövde metni.");
    await page.getByRole("button", { name: "Üye ekle" }).click();
    await page.getByLabel("Üye 1 isim").fill("Ayşe Test");
    await page.getByLabel("Üye 1 görev").fill("Başkan");
    await page.getByRole("button", { name: "Görsel ekle" }).click();
    await expect(page.getByTestId("gallery-row")).toHaveCount(1);
    await page.getByRole("button", { name: "Kaydet" }).click();
    await expect(page).toHaveURL(/\/admin\/departments\?saved=1/, SLOW);
    await expect(page.getByRole("status")).toContainText("kaydedildi", SLOW);
    await expect(page.getByRole("cell", { name, exact: true })).toBeVisible();

    // Public list card and detail page reflect the save.
    await page.goto("/departments", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: new RegExp(name) })).toBeVisible();
    await page.goto(`/departments/${slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name, level: 1 })).toBeVisible();
    await expect(page.getByText("E2E gövde metni.")).toBeVisible();
    await expect(page.getByText("Ayşe Test")).toBeVisible();
    await expect(page.getByText("Başkan")).toBeVisible();

    // Edit the text; the editor reloads with what was saved.
    await page.goto("/admin/departments", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: `${name} düzenle` }).click();
    await expect(page.getByLabel("Birim adı")).toHaveValue(name);
    await hydrated(page);
    await expect(page.getByLabel("Üye 1 isim")).toHaveValue("Ayşe Test");
    await page.getByLabel("Kısa açıklama").fill("Güncel özet");
    await page.getByRole("button", { name: "Güncelle" }).click();
    await expect(page).toHaveURL(/\/admin\/departments\?saved=1/, SLOW);
    await page.goto(`/departments/${slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Güncel özet")).toBeVisible();

    // Unpublish: the public page 404s.
    await page.goto("/admin/departments", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: `${name} düzenle` }).click();
    await page.getByLabel(/Yayında/).uncheck();
    await page.getByRole("button", { name: "Güncelle" }).click();
    await expect(page).toHaveURL(/\/admin\/departments\?saved=1/, SLOW);
    const hidden = await page.goto(`/departments/${slug}`, { waitUntil: "domcontentloaded" });
    expect(hidden?.status()).toBe(404);

    // Delete through the inline confirmation (no native dialog).
    await page.goto("/admin/departments", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: `${name} sil` }).click();
    await page.getByRole("button", { name: "Evet, sil" }).click();
    await expect(page.getByRole("cell", { name, exact: true })).toHaveCount(0);
  } finally {
    await page.goto("/admin/departments", { waitUntil: "domcontentloaded" });
    await deleteDepartmentsByName(page, "E2E Birim");
  }
});

test("department editor: a duplicate slug shows an error and saves nothing", async ({ page }) => {
  const stamp = Date.now();
  const name = `E2E Kopya ${stamp}`;
  await page.goto("/admin/departments", { waitUntil: "domcontentloaded" });
  try {
    for (const attempt of [1, 2]) {
      await openForm(page, "/admin/departments/new");
      await page.getByLabel("Birim adı").fill(name);
      await page.getByRole("button", { name: "Kaydet" }).click();
      if (attempt === 1) await expect(page).toHaveURL(/saved=1/, SLOW);
    }
    await expect(page.locator("p[role=alert]")).toContainText("slug");
    await page.goto("/admin/departments", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("cell", { name, exact: true })).toHaveCount(1);
  } finally {
    await page.goto("/admin/departments", { waitUntil: "domcontentloaded" });
    await deleteDepartmentsByName(page, "E2E Kopya");
  }
});

test("team member: create, appears on /about-us, edit, delete", async ({ page }) => {
  const stamp = Date.now();
  const name = `E2E Üye ${stamp}`;

  try {
    await openForm(page, "/admin/team-members/new");
    await page.getByLabel("İsim").fill(name);
    await page.getByLabel("Rol").fill("Test Rolü");
    await page.getByRole("button", { name: "Kaydet" }).click();
    await expect(page).toHaveURL(/\/admin\/team-members\?saved=1$/, SLOW);
    await expect(page.getByRole("cell", { name, exact: true })).toBeVisible();

    await page.goto("/about-us", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(name)).toBeVisible();

    // Edit, then delete through the inline confirmation.
    await page.goto("/admin/team-members", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: `${name} sil` }).click();
    await page.getByRole("button", { name: "Evet, sil" }).click();
    await expect(page.getByRole("cell", { name, exact: true })).toHaveCount(0);
  } finally {
    await page.goto("/admin/team-members", { waitUntil: "domcontentloaded" });
    await page.evaluate(async (target) => {
      const list: { id: string; name: string }[] = await (await fetch("/api/admin/team-members")).json();
      for (const member of list.filter((m) => m.name.startsWith(target))) {
        await fetch(`/api/admin/team-members/${member.id}`, { method: "DELETE" });
      }
    }, "E2E Üye");
  }
});

test("hero slider: add, show on the homepage, reorder, hide, and the one-active rule", async ({ page }) => {
  const title = `E2E Slayt ${Date.now()}`;

  await openForm(page, "/admin/slider");
  const rows = page.getByTestId("slide-row");
  const initial = await rows.count();
  await page.getByRole("button", { name: "Slayt ekle" }).click();
  await expect(rows).toHaveCount(initial + 1);

  const n = initial + 1;
  await page.getByLabel(`${n}. slayt başlık üst satır`).fill(title);
  await page.getByLabel(`${n}. slayt başlık alt satır`).fill("İkinci");
  await page.getByLabel(`${n}. slayt yayında`).check();
  await page.getByRole("button", { name: "Slaytları kaydet" }).click();
  await expect(page).toHaveURL(/\/admin\/slider\?saved=1/, SLOW);
  await expect(page.getByRole("status")).toContainText("kaydedildi");

  // The homepage is now a carousel and the new slide is reachable.
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("button", { name: "Sonraki slayt" })).toBeVisible(SLOW);
  await page.getByRole("button", { name: "Sonraki slayt" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(title);

  // Move it to the front: it is then the first thing visitors see.
  await openForm(page, "/admin/slider");
  await page.getByRole("button", { name: `${n}. slaytı yukarı taşı` }).click();
  await page.getByRole("button", { name: "Slaytları kaydet" }).click();
  await expect(page).toHaveURL(/saved=1/, SLOW);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(title, SLOW);

  // Hiding every slide is refused with a message and saves nothing.
  await openForm(page, "/admin/slider");
  const count = await rows.count();
  for (let i = 1; i <= count; i++) await page.getByLabel(`${i}. slayt yayında`).uncheck();
  await page.getByRole("button", { name: "Slaytları kaydet" }).click();
  await expect(page.locator(".admin-feedback-error")).toContainText("En az bir slayt", SLOW);

  // Clean up: remove the e2e slide through the inline confirmation.
  await openForm(page, "/admin/slider");
  await page.getByLabel("1. slayt başlık üst satır").waitFor();
  const first = await page.getByLabel("1. slayt başlık üst satır").inputValue();
  if (first === title) {
    await page.getByRole("button", { name: "1. slaytı sil" }).click();
    await page.getByRole("button", { name: "Evet, sil" }).click();
    await expect(rows).toHaveCount(count - 1);
    await page.getByRole("button", { name: "Slaytları kaydet" }).click();
    await expect(page).toHaveURL(/saved=1/, SLOW);
  }
});

test("lists: search narrows, paging works, and delete asks inline first", async ({ page }) => {
  // Deletes confirm inline; a native dialog opening anywhere in this flow is a regression.
  const dialogs: string[] = [];
  page.on("dialog", (dialog) => {
    dialogs.push(dialog.message());
    void dialog.dismiss();
  });
  await page.goto("/admin/blog-posts", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("status").filter({ hasText: /kayıt/ })).toBeVisible(SLOW);
  const total = Number((await page.getByRole("status").filter({ hasText: /kayıt/ }).innerText()).match(/\d+/)![0]);
  expect(total).toBeGreaterThan(20);

  // Paging: 20 rows a page.
  await expect(page.locator("tbody tr")).toHaveCount(20);
  await page.getByRole("button", { name: "Sonraki" }).click();
  await expect(page.getByText(/^2 \/ \d+$/)).toBeVisible();

  // Search narrows the whole list and resets to page one.
  await page.getByRole("searchbox", { name: "Listede ara" }).fill("zzzz-no-such-post");
  await expect(page.getByText("için sonuç bulunamadı")).toBeVisible();
  await page.getByRole("searchbox", { name: "Listede ara" }).fill("");
  await expect(page.locator("tbody tr")).toHaveCount(20);
  expect(dialogs).toEqual([]);
});

test("blog post: create, appears publicly, edit, delete through the inline confirm", async ({ page }) => {
  const stamp = Date.now();
  const title = `E2E Yazı ${stamp}`;
  const edited = `${title} güncel`;

  try {
    await openForm(page, "/admin/blog-posts/new");
    await page.getByLabel("Başlık").fill(title);
    await page.getByLabel("Özet").fill("E2E özet metni");
    await page.locator(".w-md-editor-text-input").fill("## Gövde\n\nE2E gövde metni.");
    await page.getByRole("button", { name: "Kaydet" }).click();
    await expect(page).toHaveURL(/\/admin\/blog-posts\?saved=1$/, SLOW);

    const slug = await page.evaluate(async (t) => {
      const list: { slug: string; title: string }[] = await (await fetch("/api/admin/blog-posts")).json();
      return list.find((p) => p.title === t)?.slug;
    }, title);
    expect(slug).toBeTruthy();

    await page.goto(`/news-blogs/${slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: title, exact: true }).last()).toBeVisible(SLOW);
    await expect(page.getByText("E2E gövde metni.")).toBeVisible();

    // Edit the title; the public page follows.
    await page.goto("/admin/blog-posts", { waitUntil: "domcontentloaded" });
    await page.getByRole("searchbox", { name: "Listede ara" }).fill(title);
    await page.getByRole("link", { name: `${title} düzenle` }).click();
    await hydrated(page);
    await expect(page.getByLabel("Başlık")).toHaveValue(title);
    await page.getByLabel("Başlık").fill(edited);
    await page.getByRole("button", { name: "Güncelle" }).click();
    await expect(page).toHaveURL(/\/admin\/blog-posts\?saved=1$/, SLOW);
    await page.goto(`/news-blogs/${slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: edited, exact: true }).last()).toBeVisible(SLOW);

    // Delete: asks first, then the page is gone.
    await page.goto("/admin/blog-posts", { waitUntil: "domcontentloaded" });
    await page.getByRole("searchbox", { name: "Listede ara" }).fill(edited);
    await page.getByRole("button", { name: `${edited} sil` }).click();
    await expect(page.getByText("Silinsin mi?")).toBeVisible();
    await page.getByRole("button", { name: "Evet, sil" }).click();
    await expect(page.getByText("için sonuç bulunamadı")).toBeVisible();
    const gone = await page.goto(`/news-blogs/${slug}`, { waitUntil: "domcontentloaded" });
    expect(gone?.status()).toBe(404);
  } finally {
    await page.goto("/admin/blog-posts", { waitUntil: "domcontentloaded" });
    await page.evaluate(async () => {
      const list: { id: string; title: string }[] = await (await fetch("/api/admin/blog-posts")).json();
      for (const post of list.filter((p) => p.title.startsWith("E2E Yazı"))) {
        await fetch(`/api/admin/blog-posts/${post.id}`, { method: "DELETE" });
      }
    });
  }
});

test("president section (server action): save shows on the homepage, then restore", async ({ page }) => {
  const stamp = Date.now();
  const name = `E2E Başkan ${stamp}`;

  await openForm(page, "/admin/president");
  const nameInput = page.locator('input[name="name"]');
  const original = await nameInput.inputValue();
  try {
    await nameInput.fill(name);
    await page.getByRole("button", { name: "Başkan bölümünü kaydet" }).click();
    await expect(page).toHaveURL(/saved=1/, SLOW);
    await expect(page.getByRole("status")).toBeVisible();

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(name).first()).toBeVisible(SLOW);
  } finally {
    await openForm(page, "/admin/president");
    await page.locator('input[name="name"]').fill(original);
    await page.getByRole("button", { name: "Başkan bölümünü kaydet" }).click();
    await expect(page).toHaveURL(/saved=1/, SLOW);
  }
});

test("home content: a band's heading and visibility follow the admin, then restore", async ({ page }) => {
  const heading = `E2E Biz Kimiz ${Date.now()}`;

  await openForm(page, "/admin/home");
  const titleInput = page.locator('input[name="home_whoweare_title"]');
  const original = await titleInput.inputValue();
  try {
    await titleInput.fill(heading);
    await page.getByRole("button", { name: "Anasayfayı kaydet" }).click();
    await expect(page).toHaveURL(/saved=1/, SLOW);
    await expect(page.getByRole("status").filter({ hasText: "Anasayfa kaydedildi" })).toBeVisible();

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(heading)).toBeVisible(SLOW);

    // Hiding the band removes it from the homepage.
    await openForm(page, "/admin/home");
    await page.locator('input[name="home_whoweare_visible"]').uncheck();
    await page.getByRole("button", { name: "Anasayfayı kaydet" }).click();
    await expect(page).toHaveURL(/saved=1/, SLOW);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(heading)).toHaveCount(0);
  } finally {
    await openForm(page, "/admin/home");
    await page.locator('input[name="home_whoweare_title"]').fill(original);
    await page.locator('input[name="home_whoweare_visible"]').check();
    await page.getByRole("button", { name: "Anasayfayı kaydet" }).click();
    await expect(page).toHaveURL(/saved=1/, SLOW);
  }
});

test("a rejected save is shown on the form instead of failing silently", async ({ page }) => {
  const slug = `e2e-dup-${Date.now()}`;
  await page.goto("/admin/blog-posts", { waitUntil: "domcontentloaded" });
  try {
    // First post owns the slug (created through the API so only the second goes through the UI).
    const first = await page.evaluate(async (s) => {
      const res = await fetch("/api/admin/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "E2E Çakışma A", excerpt: "x", slug: s }),
      });
      return res.status;
    }, slug);
    expect(first).toBe(201);

    await openForm(page, "/admin/blog-posts/new");
    await page.getByLabel("Başlık").fill("E2E Çakışma B");
    await page.getByLabel("Slug").fill(slug);
    await page.getByRole("button", { name: "Kaydet" }).click();

    await expect(page.locator("p[role=alert]")).toContainText("başka bir kayıtta", SLOW);
    await expect(page).toHaveURL(/\/admin\/blog-posts\/new$/);
  } finally {
    await page.goto("/admin/blog-posts", { waitUntil: "domcontentloaded" });
    await page.evaluate(async () => {
      const list: { id: string; title: string }[] = await (await fetch("/api/admin/blog-posts")).json();
      for (const post of list.filter((p) => p.title.startsWith("E2E Çakışma"))) {
        await fetch(`/api/admin/blog-posts/${post.id}`, { method: "DELETE" });
      }
    });
  }
});
