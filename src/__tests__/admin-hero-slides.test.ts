import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { setupSchema, resetTables, closeHarness, countRows, revalidatedPaths } from "./helpers/admin-harness";
import { MAX_ACTIVE_HERO_SLIDES, MAX_HERO_SLIDES, parseHeroSlides, readHeroSlides } from "@/lib/hero-slides";

let actions: typeof import("@/app/admin/actions");
let home: typeof import("@/db/queries/home-sections");

beforeAll(async () => {
  await setupSchema();
  actions = await import("@/app/admin/actions");
  home = await import("@/db/queries/home-sections");
});

afterAll(closeHarness);
beforeEach(resetTables);

async function saveSlides(slides: unknown) {
  const form = new FormData();
  form.append("slides", typeof slides === "string" ? slides : JSON.stringify(slides));
  try {
    await actions.saveHeroSlides(form);
  } catch (error) {
    const digest = (error as { digest?: string }).digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) return digest.split(";")[2];
    throw error;
  }
  throw new Error("action did not redirect");
}

const slide = (n: number, extra: Record<string, unknown> = {}) => ({
  id: `s${n}`,
  titleTop: `Başlık ${n}`,
  titleBottom: `Vurgu ${n}`,
  summary: `Özet ${n}`,
  ctaLabel: "Git",
  ctaHref: "/faaliyetler/",
  image: "/image/association-community-evening.png",
  active: true,
  ...extra,
});

describe("slide validation (unit)", () => {
  it("accepts a valid list and trims fields", () => {
    const parsed = parseHeroSlides([slide(1, { titleTop: "  Merhaba  " })]);
    expect(parsed.ok && parsed.slides[0].titleTop).toBe("Merhaba");
  });

  it("rejects non-lists, non-objects, missing titles, bad links and bad images", () => {
    expect(parseHeroSlides("x")).toEqual({ ok: false, error: "invalid" });
    expect(parseHeroSlides(["x"])).toEqual({ ok: false, error: "invalid" });
    expect(parseHeroSlides([slide(1, { titleTop: "", titleBottom: "" })])).toEqual({ ok: false, error: "title" });
    expect(parseHeroSlides([slide(1, { ctaHref: "javascript:alert(1)" })])).toEqual({ ok: false, error: "href" });
    expect(parseHeroSlides([slide(1, { image: "//evil.example/x.png" })])).toEqual({ ok: false, error: "href" });
  });

  it("enforces the total, active-minimum and active-maximum limits", () => {
    const many = Array.from({ length: MAX_HERO_SLIDES + 1 }, (_, i) => slide(i, { active: false }));
    expect(parseHeroSlides(many)).toEqual({ ok: false, error: "count" });
    expect(parseHeroSlides([slide(1, { active: false })])).toEqual({ ok: false, error: "none_active" });
    const tooActive = Array.from({ length: MAX_ACTIVE_HERO_SLIDES + 1 }, (_, i) => slide(i));
    expect(parseHeroSlides(tooActive)).toEqual({ ok: false, error: "too_many_active" });
  });

  it("makes duplicate ids unique and reads damaged JSON as no slides", () => {
    const parsed = parseHeroSlides([slide(1, { id: "a" }), slide(2, { id: "a" })]);
    expect(parsed.ok && new Set(parsed.slides.map((s) => s.id)).size).toBe(2);
    expect(readHeroSlides("{broken")).toEqual([]);
    expect(readHeroSlides(undefined)).toEqual([]);
  });
});

describe("hero slider action -> public homepage", () => {
  it("an untouched site shows the single legacy hero", async () => {
    const content = await home.getHomeContent();
    expect(content.heroSlides).toHaveLength(1);
    expect(content.heroSlides[0].titleTop).toBe(content.hero.titleTop);
    expect((await home.getHeroSlidesForAdmin()).customised).toBe(false);
  });

  it("saved slides replace the legacy hero, in order, and hidden ones are not shown", async () => {
    const to = await saveSlides([slide(1), slide(2, { active: false }), slide(3)]);
    expect(to).toBe("/admin/slider?saved=1");

    const content = await home.getHomeContent();
    expect(content.heroSlides.map((s) => s.titleTop)).toEqual(["Başlık 1", "Başlık 3"]);

    const admin = await home.getHeroSlidesForAdmin();
    expect(admin.customised).toBe(true);
    expect(admin.slides.map((s) => s.active)).toEqual([true, false, true]);
    expect(revalidatedPaths).toContain("/ (layout)");
  });

  it("reordering and editing are what the public reader returns next", async () => {
    await saveSlides([slide(1), slide(2)]);
    await saveSlides([slide(2, { titleTop: "Yeni" }), slide(1)]);
    expect((await home.getHomeContent()).heroSlides.map((s) => s.titleTop)).toEqual(["Yeni", "Başlık 1"]);
  });

  it("an invalid save redirects with the reason and leaves the previous slides untouched", async () => {
    await saveSlides([slide(1)]);

    expect(await saveSlides([slide(1, { ctaHref: "javascript:alert(1)" })])).toBe("/admin/slider?error=href");
    expect(await saveSlides([slide(1, { active: false })])).toBe("/admin/slider?error=none_active");
    expect(await saveSlides("{nope")).toBe("/admin/slider?error=invalid");

    expect((await home.getHomeContent()).heroSlides.map((s) => s.titleTop)).toEqual(["Başlık 1"]);
    expect(await countRows("site_settings")).toBe(1);
  });

  it("a damaged stored value falls back to the legacy hero instead of breaking the page", async () => {
    await saveSlides([slide(1)]);
    const { testClient } = await import("./helpers/admin-harness");
    await testClient.execute("UPDATE site_settings SET value = '{broken' WHERE key = 'home_hero_slides'");
    const content = await home.getHomeContent();
    expect(content.heroSlides).toHaveLength(1);
    expect(content.heroSlides[0].id).toBe("hero");
  });
});
