import { expect, test, type Page } from "@playwright/test";

function trackRuntimeFailures(page: Page) {
  const failures: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => failures.push(`page: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() >= 500) failures.push(`http ${response.status()}: ${response.url()}`);
  });
  return failures;
}

test("desktop public content and navigation flow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "desktop flow");
  const failures = trackRuntimeFailures(page);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle(/Ana Sayfa/i);
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator('a[href^="/news-blogs/"]').first()).toBeVisible();

  await page.goto("/news-blogs?type=blog", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Blog", exact: true }).first()).toBeVisible();
  const blogCards = page.locator('a[aria-label$="yazisini oku"]');
  expect(await blogCards.count()).toBeGreaterThan(20);
  const firstTitle = await blogCards.first().locator("h3").innerText();
  await blogCards.first().click();
  await expect(page.getByRole("heading", { name: firstTitle, exact: true }).last()).toBeVisible();
  await expect(page.locator("article.prose, section article").first()).toBeVisible();

  await page.goto("/news-blogs?type=news", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Haberler", exact: true }).first()).toBeVisible();
  expect(await page.locator('a[aria-label$="yazisini oku"]').count()).toBeGreaterThan(0);

  await page.goto("/events", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /Etkinlik/ }).first()).toBeVisible();
  await expect(page.locator("main img").first()).toBeVisible();

  await page.goto("/about-us", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("main img").first()).toBeVisible();

  expect(failures, failures.join("\n")).toEqual([]);
});

test("mobile navigation and blog card flow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "mobile flow");
  const failures = trackRuntimeFailures(page);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  const menuButton = page.getByRole("button", { name: "Toggle menu" });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  await expect(page.locator("header").getByRole("link", { name: "Etkinlikler" })).toBeVisible();
  await page.locator("header").getByRole("link", { name: "Etkinlikler" }).click();
  await expect(page).toHaveURL(/\/events/);

  await page.goto("/news-blogs?type=blog", { waitUntil: "domcontentloaded" });
  const firstCard = page.locator('a[aria-label$="yazisini oku"]').first();
  await expect(firstCard).toBeVisible();
  await firstCard.click();
  await expect(page).toHaveURL(/\/news-blogs\//);

  expect(failures, failures.join("\n")).toEqual([]);
});

test("unauthenticated admin access is protected", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "single auth check");
  await page.goto("/admin", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.locator("body")).toContainText(/sign in|continue|email/i);
});

test("authenticated admin blog CRUD reaches the public site", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "single authenticated flow");
  const identifier = process.env.E2E_ADMIN_IDENTIFIER;
  const password = process.env.E2E_ADMIN_PASSWORD;
  test.skip(!identifier || !password, "E2E admin credentials are not configured");

  const unique = Date.now();
  const slug = `e2e-qa-${unique}`;
  const createdTitle = `E2E QA ${unique}`;
  const updatedTitle = `${createdTitle} Updated`;
  let postId: string | undefined;

  await page.goto("/sign-in", { waitUntil: "domcontentloaded" });
  const emailInput = page.locator('input[name="identifier"], input[type="email"]').first();
  await emailInput.fill(identifier!);
  const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
  if (!(await passwordInput.isVisible())) {
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await passwordInput.waitFor({ state: "visible" });
  }
  await passwordInput.fill(password!);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page).toHaveURL(/\/admin/);

  try {
    const created = await page.evaluate(async (payload) => {
      const response = await fetch("/api/admin/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return { status: response.status, body: await response.json() };
    }, {
      title: createdTitle,
      excerpt: "Playwright admin-to-public integration check",
      body: "This temporary post verifies authenticated CRUD and public rendering.",
      slug,
      category: "Blog",
      author: "E2E QA",
      publishedAt: new Date().toISOString(),
    });
    expect(created.status).toBe(201);
    postId = created.body.id;

    await page.goto(`/news-blogs/${slug}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: createdTitle, exact: true }).last()).toBeVisible();

    const updated = await page.evaluate(async ({ id, title }) => {
      const response = await fetch(`/api/admin/blog-posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt: "Updated through the protected admin API",
          body: "Updated temporary E2E content.",
          slug,
          category: "Blog",
          author: "E2E QA",
          publishedAt: new Date().toISOString(),
        }),
      });
      return { status: response.status, body: await response.json() };
    }, { id: postId, title: updatedTitle });
    expect(updated.status).toBe(200);

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: updatedTitle, exact: true }).last()).toBeVisible();
  } finally {
    if (postId) {
      const deleted = await page.evaluate(async (id) => {
        const response = await fetch(`/api/admin/blog-posts/${id}`, { method: "DELETE" });
        return response.status;
      }, postId);
      expect(deleted).toBe(200);
      await page.goto(`/news-blogs/${slug}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("body")).toContainText(/not found|404/i);
    }
  }
});
