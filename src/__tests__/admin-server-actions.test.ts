import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
  setupSchema,
  resetTables,
  closeHarness,
  countRows,
  revalidatedPaths,
} from "./helpers/admin-harness";

/*
  The president, YouTube and social sections post their forms straight to server
  actions instead of `/api/admin/*`. Each action finishes with `redirect()`,
  which throws a `NEXT_REDIRECT` error carrying the destination — so the
  destination is the action's status code, and `runAction` reads it back.
*/

let actions: typeof import("@/app/admin/actions");
let siteSettingsQueries: typeof import("@/db/queries/site-settings");
let socialQueries: typeof import("@/db/queries/social-accounts");

beforeAll(async () => {
  await setupSchema();
  actions = await import("@/app/admin/actions");
  siteSettingsQueries = await import("@/db/queries/site-settings");
  socialQueries = await import("@/db/queries/social-accounts");
});

afterAll(closeHarness);
beforeEach(resetTables);

/** Runs a server action and returns the path it redirected to. */
async function runAction(action: (form: FormData) => Promise<void>, fields: Record<string, string>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);

  try {
    await action(form);
  } catch (error) {
    const digest = (error as { digest?: string }).digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
      // digest is `NEXT_REDIRECT;<kind>;<url>;...`
      return digest.split(";")[2];
    }
    throw error;
  }
  throw new Error("action did not redirect");
}

describe("president section action -> public homepage", () => {
  it("saves every field and the public reader returns them", async () => {
    const to = await runAction(actions.savePresidentSection, {
      eyebrow: "BAŞKAN",
      name: "Ömer Abbas",
      role: "PTÖB Başkanı",
      bio: "Afet Yönetimi yüksek lisans öğrencisi.",
      imageUrl: "/image/leader.png",
      imageAlt: "PTÖB Başkanı",
      visible: "on",
    });
    expect(to).toBe("/admin/president?saved=1");

    const president = await siteSettingsQueries.getPresidentSection();
    expect(president.name).toBe("Ömer Abbas");
    expect(president.role).toBe("PTÖB Başkanı");
    expect(president.bio).toBe("Afet Yönetimi yüksek lisans öğrencisi.");
    expect(president.imageUrl).toBe("/image/leader.png");
    expect(president.imageAlt).toBe("PTÖB Başkanı");
    expect(president.visible).toBe(true);
  });

  it("an unchecked visibility box hides the section from the homepage", async () => {
    await runAction(actions.savePresidentSection, { name: "Ad", role: "Rol" });
    expect((await siteSettingsQueries.getPresidentSection()).visible).toBe(false);
  });

  it("requires a name and a role, and writes nothing without them", async () => {
    expect(await runAction(actions.savePresidentSection, { role: "Rol" })).toBe(
      "/admin/president?error=required",
    );
    expect(await runAction(actions.savePresidentSection, { name: "Ad" })).toBe(
      "/admin/president?error=required",
    );
    expect(await countRows("site_settings")).toBe(0);
  });

  it("refuses a javascript: image address so it cannot reach the homepage", async () => {
    const to = await runAction(actions.savePresidentSection, {
      name: "Ad",
      role: "Rol",
      imageUrl: "javascript:alert(1)",
    });
    expect(to).toBe("/admin/president?error=image");
    expect(await countRows("site_settings")).toBe(0);
  });

  it("accepts an absolute HTTPS image address", async () => {
    const to = await runAction(actions.savePresidentSection, {
      name: "Ad",
      role: "Rol",
      imageUrl: "https://res.cloudinary.com/test/image/upload/baskan.jpg",
    });
    expect(to).toBe("/admin/president?saved=1");
    expect((await siteSettingsQueries.getPresidentSection()).imageUrl).toBe(
      "https://res.cloudinary.com/test/image/upload/baskan.jpg",
    );
  });

  it("falls back to the shipped copy before anything is saved", async () => {
    const president = await siteSettingsQueries.getPresidentSection();
    expect(president.name).toBe("Ömer Abbas");
    expect(president.visible).toBe(true);
    expect(president.imageUrl).toBe("/image/leader.png");
  });

  it("revalidates the root layout on save", async () => {
    await runAction(actions.savePresidentSection, { name: "Ad", role: "Rol" });
    expect(revalidatedPaths).toContain("/ (layout)");
  });
});

describe("youtube section action -> public homepage", () => {
  it("saves a watch URL and the public reader returns it", async () => {
    const to = await runAction(actions.saveYoutubeSection, {
      eyebrow: "SON YAYIN",
      title: "Tanıtım Videosu",
      description: "Birliğin tanıtım videosu.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channelUrl: "https://www.youtube.com/@ptob",
      ctaLabel: "Kanalı Takip Et",
      tags: "tanıtım, öğrenci",
      visible: "on",
    });
    expect(to).toBe("/admin/youtube?saved=1");

    const section = await siteSettingsQueries.getYoutubeSection();
    expect(section.title).toBe("Tanıtım Videosu");
    expect(section.videoUrl).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(section.channelUrl).toBe("https://www.youtube.com/@ptob");
    expect(section.tags).toEqual(["tanıtım", "öğrenci"]);
    expect(section.visible).toBe(true);
  });

  it("normalises a channel address to its canonical form", async () => {
    await runAction(actions.saveYoutubeSection, {
      videoUrl: "",
      channelUrl: "youtube.com/channel/UCabcdefghijklmnopqrstu",
    });
    expect((await siteSettingsQueries.getYoutubeSection()).channelUrl).toBe(
      "https://www.youtube.com/channel/UCabcdefghijklmnopqrstu",
    );
  });

  it("accepts a youtu.be short link", async () => {
    const to = await runAction(actions.saveYoutubeSection, {
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
      channelUrl: "",
    });
    expect(to).toBe("/admin/youtube?saved=1");
  });

  it("refuses a video address that is not a YouTube link", async () => {
    const to = await runAction(actions.saveYoutubeSection, {
      videoUrl: "https://vimeo.com/12345",
      channelUrl: "",
    });
    expect(to).toBe("/admin/youtube?error=video");
    expect(await countRows("site_settings")).toBe(0);
  });

  it("refuses a malformed channel address", async () => {
    const to = await runAction(actions.saveYoutubeSection, {
      videoUrl: "",
      channelUrl: "https://example.org/kanal",
    });
    expect(to).toBe("/admin/youtube?error=channel");
    expect(await countRows("site_settings")).toBe(0);
  });

  it("an unchecked visibility box takes the block off the homepage", async () => {
    await runAction(actions.saveYoutubeSection, { videoUrl: "", channelUrl: "" });
    expect((await siteSettingsQueries.getYoutubeSection()).visible).toBe(false);
  });

  it("splits and trims the tag list, dropping blanks", async () => {
    await runAction(actions.saveYoutubeSection, {
      videoUrl: "",
      channelUrl: "",
      tags: " bir ,, iki ,  ",
    });
    expect((await siteSettingsQueries.getYoutubeSection()).tags).toEqual(["bir", "iki"]);
  });
});

describe("social accounts action -> public footer", () => {
  function accountsForm(accounts: unknown[]) {
    return { accounts: JSON.stringify(accounts) };
  }

  it("saves accounts and the public footer reader returns the linked ones", async () => {
    const to = await runAction(
      actions.saveSocialAccounts,
      accountsForm([
        { platform: "facebook", label: "Facebook", url: "https://facebook.com/ptob", active: true },
        { platform: "instagram", label: "Instagram", url: "https://instagram.com/ptob", active: true },
      ]),
    );
    expect(to).toBe("/admin/social?saved=1");

    const visible = await socialQueries.getVisibleSocialAccounts();
    expect(visible.map((a) => a.platform)).toEqual(["facebook", "instagram"]);
    expect(visible[0].url).toBe("https://facebook.com/ptob");
  });

  it("keeps the on-screen order as the public order", async () => {
    await runAction(
      actions.saveSocialAccounts,
      accountsForm([
        { platform: "youtube", url: "https://youtube.com/@ptob" },
        { platform: "facebook", url: "https://facebook.com/ptob" },
        { platform: "instagram", url: "https://instagram.com/ptob" },
      ]),
    );

    expect((await socialQueries.getVisibleSocialAccounts()).map((a) => a.platform)).toEqual([
      "youtube",
      "facebook",
      "instagram",
    ]);
  });

  it("drops a link-less account from the footer but keeps it in the editor", async () => {
    await runAction(
      actions.saveSocialAccounts,
      accountsForm([
        { platform: "facebook", url: "https://facebook.com/ptob" },
        { platform: "instagram", url: "" },
      ]),
    );

    expect((await socialQueries.getVisibleSocialAccounts()).map((a) => a.platform)).toEqual(["facebook"]);
    expect((await socialQueries.getAllSocialAccounts()).map((a) => a.platform)).toEqual([
      "facebook",
      "instagram",
    ]);
  });

  it("an inactive account is hidden from the footer", async () => {
    await runAction(
      actions.saveSocialAccounts,
      accountsForm([
        { platform: "facebook", url: "https://facebook.com/ptob", active: false },
        { platform: "instagram", url: "https://instagram.com/ptob", active: true },
      ]),
    );

    expect((await socialQueries.getVisibleSocialAccounts()).map((a) => a.platform)).toEqual(["instagram"]);
  });

  it("a removed row really disappears, because the table is rewritten", async () => {
    await runAction(
      actions.saveSocialAccounts,
      accountsForm([
        { platform: "facebook", url: "https://facebook.com/ptob" },
        { platform: "instagram", url: "https://instagram.com/ptob" },
      ]),
    );
    expect(await countRows("social_accounts")).toBe(2);

    await runAction(
      actions.saveSocialAccounts,
      accountsForm([{ platform: "facebook", url: "https://facebook.com/ptob" }]),
    );

    expect(await countRows("social_accounts")).toBe(1);
    expect((await socialQueries.getVisibleSocialAccounts()).map((a) => a.platform)).toEqual(["facebook"]);
  });

  it("refuses a javascript: link so it can never render in the footer", async () => {
    const to = await runAction(
      actions.saveSocialAccounts,
      accountsForm([{ platform: "facebook", url: "javascript:alert(1)" }]),
    );
    expect(to).toBe("/admin/social?error=url");
    expect(await countRows("social_accounts")).toBe(0);
  });

  it("refuses a row with a link but no platform", async () => {
    const to = await runAction(
      actions.saveSocialAccounts,
      accountsForm([{ platform: "", url: "https://facebook.com/ptob" }]),
    );
    expect(to).toBe("/admin/social?error=platform");
  });

  it("silently drops a wholly empty row the editor never filled in", async () => {
    const to = await runAction(
      actions.saveSocialAccounts,
      accountsForm([
        { platform: "facebook", url: "https://facebook.com/ptob" },
        { platform: "", url: "" },
      ]),
    );
    expect(to).toBe("/admin/social?saved=1");
    expect(await countRows("social_accounts")).toBe(1);
  });

  it("rejects a malformed payload without touching the saved list", async () => {
    await runAction(
      actions.saveSocialAccounts,
      accountsForm([{ platform: "facebook", url: "https://facebook.com/ptob" }]),
    );

    expect(await runAction(actions.saveSocialAccounts, { accounts: "{not json" })).toBe(
      "/admin/social?error=payload",
    );
    expect(await runAction(actions.saveSocialAccounts, { accounts: '{"a":1}' })).toBe(
      "/admin/social?error=payload",
    );
    expect(await countRows("social_accounts")).toBe(1);
  });

  it("lower-cases the platform so the icon always matches", async () => {
    await runAction(
      actions.saveSocialAccounts,
      accountsForm([{ platform: "FaceBook", url: "https://facebook.com/ptob" }]),
    );
    expect((await socialQueries.getVisibleSocialAccounts())[0].platform).toBe("facebook");
  });

  it("offers the seeded defaults before anything has been saved", async () => {
    const all = await socialQueries.getAllSocialAccounts();
    expect(all.map((a) => a.platform)).toEqual(["facebook", "instagram", "youtube"]);
    // Only the one with a real link is offered to the footer.
    expect(await socialQueries.getVisibleSocialAccounts()).toHaveLength(1);
  });

  it("revalidates the root layout so the footer refreshes", async () => {
    await runAction(
      actions.saveSocialAccounts,
      accountsForm([{ platform: "facebook", url: "https://facebook.com/ptob" }]),
    );
    expect(revalidatedPaths).toContain("/ (layout)");
  });
});
