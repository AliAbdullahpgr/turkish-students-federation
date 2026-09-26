import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { setupSchema, resetTables, closeHarness } from "./helpers/admin-harness";

/*
  The homepage editor.

  Every band of the homepage is now driven by a key in `HOME_SECTIONS`. The
  risk this file guards is the one the settings endpoint already shipped once:
  a field rendered by the form that the save path quietly drops, so the panel
  reports success and the site does not change. Here the form and the action
  are both generated from the same spec, and the test below walks that spec
  rather than a list copied out of it — a new field is covered the moment it is
  added.
*/

let actions: typeof import("@/app/admin/actions");
let homeSections: typeof import("@/db/queries/home-sections");

beforeAll(async () => {
  await setupSchema();
  actions = await import("@/app/admin/actions");
  homeSections = await import("@/db/queries/home-sections");
});

afterAll(closeHarness);
beforeEach(resetTables);

/** Runs a server action and returns the path it redirected to. */
async function runAction(
  action: (form: FormData) => Promise<void>,
  fields: Record<string, string>,
) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  try {
    await action(form);
  } catch (error) {
    const digest = (error as { digest?: string }).digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) return digest.split(";")[2];
    throw error;
  }
  throw new Error("action did not redirect");
}

/** A value the field will accept, distinctive enough to find in the stored row. */
function sampleFor(field: import("@/db/queries/home-sections").HomeField) {
  if (field.kind === "toggle") return "on";
  if (field.kind === "href") return `/faaliyetler/?k=${field.key}`;
  if (field.kind === "image") return `/image/${field.key}.png`;
  return `deger-${field.key}`;
}

describe("the homepage editor stores every field it offers", () => {
  it("saves each key in the spec", async () => {
    const payload: Record<string, string> = {};
    for (const field of homeSections.HOME_FIELDS) payload[field.key] = sampleFor(field);

    const redirect = await runAction(actions.saveHomeContent, payload);
    expect(redirect).toBe("/admin/home?saved=1");

    const { getAllSiteSettings } = await import("@/db/queries/site-settings");
    const stored = await getAllSiteSettings();

    for (const field of homeSections.HOME_FIELDS) {
      expect(Object.hasOwn(stored, field.key), `${field.key} was not stored`).toBe(true);
      if (field.kind !== "toggle") {
        expect(stored[field.key], `${field.key} stored the wrong value`).toBe(sampleFor(field));
      }
    }
  });

  it("reaches the public reader for every section", async () => {
    await runAction(actions.saveHomeContent, {
      home_title_top: "UST-SATIR",
      home_blog_title: "BLOG-BASLIK",
      home_whatwedo_title: "NE-YAPIYORUZ",
      home_events_title: "ETKINLIK-BASLIK",
      home_courses_title: "KURS-BASLIK",
      home_activities_title: "FAALIYET-BASLIK",
      home_facebook_url: "https://facebook.com/ptob",
    });

    const home = await homeSections.getHomeContent();
    expect(home.hero.titleTop).toBe("UST-SATIR");
    expect(home.blog.title).toBe("BLOG-BASLIK");
    expect(home.whatWeDo.title).toBe("NE-YAPIYORUZ");
    expect(home.events.title).toBe("ETKINLIK-BASLIK");
    expect(home.courses.title).toBe("KURS-BASLIK");
    expect(home.activityPosts.title).toBe("FAALIYET-BASLIK");
    expect(home.facebook.url).toBe("https://facebook.com/ptob");
  });
});

describe("section visibility", () => {
  it("an unchecked box hides the section but keeps the copy", async () => {
    // An unchecked checkbox submits nothing at all, so the omission is the "off".
    await runAction(actions.saveHomeContent, { home_blog_title: "BLOG-BASLIK" });

    const home = await homeSections.getHomeContent();
    expect(home.blog.visible).toBe(false);
    expect(home.whatWeDo.visible).toBe(false);
    // The text survives being hidden, so switching the section back on restores it.
    expect(home.blog.title).toBe("BLOG-BASLIK");
  });

  it("a checked box shows the section", async () => {
    await runAction(actions.saveHomeContent, { home_blog_visible: "on" });
    expect((await homeSections.getHomeContent()).blog.visible).toBe(true);
  });

  it("defaults to visible before anything has been saved", async () => {
    const home = await homeSections.getHomeContent();
    expect(home.blog.visible).toBe(true);
    expect(home.facebook.visible).toBe(true);
  });
});

describe("link validation", () => {
  it("refuses a javascript: link and writes nothing", async () => {
    const redirect = await runAction(actions.saveHomeContent, {
      home_title_top: "YAZILMAMALI",
      home_hero_cta_href: "javascript:alert(1)",
    });

    expect(redirect).toContain("error=href");
    expect(redirect).toContain("home_hero_cta_href");

    const { getAllSiteSettings } = await import("@/db/queries/site-settings");
    expect(await getAllSiteSettings()).toEqual({});
  });

  it("accepts a blank link as 'no button'", async () => {
    await runAction(actions.saveHomeContent, { home_hero_cta_href: "" });
    expect((await homeSections.getHomeContent()).hero.ctaHref).toBe("");
  });

  it("accepts an absolute https address", async () => {
    await runAction(actions.saveHomeContent, {
      home_facebook_url: "https://facebook.com/pakturkogrencibirligi",
    });
    expect((await homeSections.getHomeContent()).facebook.url).toBe(
      "https://facebook.com/pakturkogrencibirligi",
    );
  });
});

describe("fallbacks", () => {
  it("uses the shipped copy for a key that has never been saved", async () => {
    const home = await homeSections.getHomeContent();
    expect(home.blog.title).toBe("Blog");
    expect(home.activityPosts.href).toBe("/faaliyetler/");
    // The hero button points at the activities page, not the blog listing.
    expect(home.hero.ctaHref).toBe("/faaliyetler/");
    expect(home.whoWeAre.linkHref).toBe("/about-us/");
  });

  it("honours a deliberately cleared field instead of restoring the default", async () => {
    await runAction(actions.saveHomeContent, { home_blog_lede: "" });
    expect((await homeSections.getHomeContent()).blog.lede).toBe("");
  });
});
