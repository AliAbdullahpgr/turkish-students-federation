import { describe, it, expect } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
const db = drizzle(turso);

// These tests verify the seeded data is complete and correct

describe("Seed Data Integrity", () => {
  describe("site_settings", () => {
    it("has all 14 expected keys", async () => {
      const { siteSettings } = await import("@/db/schema/site-settings");
      const rows = await db.select().from(siteSettings).all();
      expect(rows.length).toBe(14);

      const keys = rows.map((r) => r.key).sort();
      expect(keys).toContain("site_name");
      expect(keys).toContain("site_short_name");
      expect(keys).toContain("guide_name");
      expect(keys).toContain("guide_href");
      expect(keys).toContain("join_href");
      expect(keys).toContain("site_description");
      expect(keys).toContain("guide_description");
      expect(keys).toContain("home_eyebrow");
      expect(keys).toContain("home_title_top");
      expect(keys).toContain("home_title_bottom");
      expect(keys).toContain("home_summary");
      expect(keys).toContain("home_primary_cta");
      expect(keys).toContain("home_secondary_cta");
      expect(keys).toContain("home_about_intro");
    });
  });

  describe("blog_posts", () => {
    it("has all 6 posts with expected slugs", async () => {
      const { blogPosts } = await import("@/db/schema/blog-posts");
      const rows = await db.select().from(blogPosts).all();
      expect(rows.length).toBe(6);

      const slugs = rows.map((r) => r.slug);
      expect(slugs).toContain("rising-prices-burden-on-students");
      expect(slugs).toContain("tsf-hope-for-students");
      expect(slugs).toContain("teaching-quran");
      expect(slugs).toContain("ex-president-ans-muhsi");
      expect(slugs).toContain("umer-abbas-president");
      expect(slugs).toContain("farewell-ans-muhsi");

      // Verify every post has required fields
      for (const row of rows) {
        expect(row.title).toBeTruthy();
        expect(row.slug).toBeTruthy();
        expect(row.excerpt).toBeTruthy();
      }
    });
  });

  describe("events", () => {
    it("has 2 upcoming and 2 recent events", async () => {
      const { events } = await import("@/db/schema/events");
      const rows = await db.select().from(events).all();
      expect(rows.length).toBe(4);

      const upcoming = rows.filter((r) => r.status === "upcoming");
      const recent = rows.filter((r) => r.status === "recent");
      expect(upcoming.length).toBe(2);
      expect(recent.length).toBe(2);
    });
  });

  describe("guide_sections", () => {
    it("has correct hierarchy depth", async () => {
      const { guideSections } = await import("@/db/schema/guide-sections");
      const rows = await db.select().from(guideSections).all();

      const levels = new Set(rows.map((r) => r.level));
      expect(levels.has(2)).toBe(true);
      expect(levels.has(3)).toBe(true);
      expect(levels.has(4)).toBe(true);

      // Verify no orphaned children (every child has an existing parent)
      const ids = new Set(rows.map((r) => r.id));
      const children = rows.filter((r) => r.parentId !== null);
      for (const child of children) {
        expect(ids.has(child.parentId!)).toBe(true);
      }
    });

    it("has all top-level sections", async () => {
      const { guideSections } = await import("@/db/schema/guide-sections");
      const rows = await db.select().from(guideSections).all();
      const topLevel = rows.filter((r) => r.parentId === null);
      const titles = topLevel.map((r) => r.title);

      expect(titles).toContain("BİZ KİMİZ?");
      expect(titles).toContain("KISA TARİHİ");
      expect(titles).toContain("VİZE VE PASAPORT");
      expect(titles).toContain("ÜNİVERSİTELER");
      expect(titles).toContain("SAĞLIK");
      expect(titles).toContain("KONAKLAMA");
    });
  });

  describe("navigation_items", () => {
    it("has correct parent-child relationships", async () => {
      const { navigationItems } = await import("@/db/schema/navigation-items");
      const rows = await db.select().from(navigationItems).all();

      const ids = new Set(rows.map((r) => r.id));
      const children = rows.filter((r) => r.parentId !== null);

      // Every child's parent must exist
      for (const child of children) {
        expect(ids.has(child.parentId!)).toBe(true);
      }

      // Must have at least one dropdown (parent with children)
      const parentIds = new Set(children.map((c) => c.parentId));
      expect(parentIds.size).toBeGreaterThan(0);
    });
  });

  describe("data consistency", () => {
    it("all tables are non-empty (seeded)", async () => {
      const tables = [
        "site_settings", "blog_posts", "events", "team_members",
        "courses", "activities", "guide_sections", "navigation_items",
      ];

      for (const table of tables) {
        const result = await turso.execute(`SELECT count(*) as c FROM ${table}`);
        expect(Number(result.rows[0].c)).toBeGreaterThan(0);
      }
    });

    it("siteIdentity fields match expected values", async () => {
      const { siteSettings } = await import("@/db/schema/site-settings");
      const rows = await db.select().from(siteSettings).all();

      const getVal = (key: string) => rows.find((r) => r.key === key)?.value;

      expect(getVal("site_name")).toBe("Pakistan Türk Öğrenci Birliği");
      expect(getVal("site_short_name")).toBe("PTÖB");
      expect(getVal("guide_name")).toBe("Pakistan Öğrenci Rehberi");
      expect(getVal("guide_href")).toBe("/pakistan-rehberi/");
      expect(getVal("join_href")).toBe("/join-tsf/");
    });

    it("homeMessaging fields match expected values", async () => {
      const { siteSettings } = await import("@/db/schema/site-settings");
      const rows = await db.select().from(siteSettings).all();

      const getVal = (key: string) => rows.find((r) => r.key === key)?.value;

      expect(getVal("home_eyebrow")).toBe("Pakistan Öğrenci Rehberi");
      expect(getVal("home_title_top")).toBe("Pakistan'da");
      expect(getVal("home_title_bottom")).toBe("Öğrenci Hayatı");
      expect(getVal("home_primary_cta")).toBe("Rehberi Aç");
      expect(getVal("home_secondary_cta")).toBe("Bize Katıl");
    });
  });
});
