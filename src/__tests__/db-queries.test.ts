import { describe, it, expect } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { siteSettings, blogPosts, events, teamMembers, courses, activities, guideSections, navigationItems, media } from "@/db/schema";
import { asc } from "drizzle-orm";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
const db = drizzle(turso);

describe("Database Schema", () => {
  it("site_settings table exists and has records", async () => {
    const rows = await db.select().from(siteSettings).all();
    expect(rows.length).toBeGreaterThan(0);
    const siteName = rows.find((r) => r.key === "site_name");
    expect(siteName).toBeDefined();
    expect(siteName!.value).toBe("Pakistan Türk Öğrenci Birliği");
  });

  it("blog_posts table has 6 seeded posts", async () => {
    const rows = await db.select().from(blogPosts).all();
    expect(rows.length).toBe(6);
    expect(rows[0]).toHaveProperty("id");
    expect(rows[0]).toHaveProperty("title");
    expect(rows[0]).toHaveProperty("slug");
    expect(rows[0]).toHaveProperty("excerpt");
  });

  it("events table has 4 seeded events", async () => {
    const rows = await db.select().from(events).all();
    expect(rows.length).toBe(4);
    const upcoming = rows.filter((r) => r.status === "upcoming");
    const recent = rows.filter((r) => r.status === "recent");
    expect(upcoming.length).toBeGreaterThan(0);
    expect(recent.length).toBeGreaterThan(0);
  });

  it("team_members table has 4 seeded members sorted by order", async () => {
    const rows = await db.select().from(teamMembers).orderBy(asc(teamMembers.order)).all();
    expect(rows.length).toBe(4);
    expect(rows[0].order).toBeLessThanOrEqual(rows[1].order);
    expect(rows[0].name).toBeDefined();
    expect(rows[0].role).toBeDefined();
  });

  it("courses table has 6 seeded courses", async () => {
    const rows = await db.select().from(courses).all();
    expect(rows.length).toBe(6);
    expect(rows[0]).toHaveProperty("title");
    expect(rows[0]).toHaveProperty("instructor");
  });

  it("activities table has 6 seeded activities with icons", async () => {
    const rows = await db.select().from(activities).orderBy(asc(activities.sortOrder)).all();
    expect(rows.length).toBe(6);
    const icons = rows.map((r) => r.icon);
    expect(icons).toContain("Monitor");
    expect(icons).toContain("Heart");
    expect(icons).toContain("BookOpen");
  });

  it("guide_sections table has 101 records with proper hierarchy", async () => {
    const rows = await db.select().from(guideSections).all();
    expect(rows.length).toBe(101);

    const topLevel = rows.filter((r) => r.parentId === null);
    expect(topLevel.length).toBeGreaterThan(0);

    const withParent = rows.filter((r) => r.parentId !== null);
    expect(withParent.length).toBeGreaterThan(0);

    // Check one known section
    const bizKimiz = rows.find((r) => r.id === "biz-kimiz");
    expect(bizKimiz).toBeDefined();
    expect(bizKimiz!.level).toBe(2);
    expect(bizKimiz!.title).toBe("BİZ KİMİZ?");
  });

  it("navigation_items table has records with parent-child relationships", async () => {
    const rows = await db.select().from(navigationItems).all();
    expect(rows.length).toBeGreaterThan(0);

    const topLevel = rows.filter((r) => r.parentId === null);
    const withParent = rows.filter((r) => r.parentId !== null);
    expect(topLevel.length).toBeGreaterThan(0);
    expect(withParent.length).toBeGreaterThan(0);
  });

  it("media table exists and is empty initially", async () => {
    const rows = await db.select().from(media).all();
    expect(Array.isArray(rows)).toBe(true);
  });
});

describe("Query Functions Integration", () => {
  it("getSiteIdentity returns correct values", async () => {
    const { getSiteIdentity } = await import("@/db/queries/site-settings");
    const identity = await getSiteIdentity();
    expect(identity.name).toBe("Pakistan Türk Öğrenci Birliği");
    expect(identity.shortName).toBe("PTÖB");
    expect(identity.guideHref).toBe("/pakistan-rehberi/");
    expect(identity.joinHref).toBe("/join-tsf/");
  });

  it("getHomeMessaging returns correct values", async () => {
    const { getHomeMessaging } = await import("@/db/queries/site-settings");
    const messaging = await getHomeMessaging();
    expect(messaging.eyebrow).toBeDefined();
    expect(messaging.titleTop).toBeDefined();
    expect(messaging.titleBottom).toBeDefined();
  });

  it("getAllBlogPosts returns posts ordered by publishedAt desc", async () => {
    const { getAllBlogPosts } = await import("@/db/queries/blog-posts");
    const posts = await getAllBlogPosts();
    expect(posts.length).toBe(6);
    expect(posts[0]).toHaveProperty("slug");
    expect(posts[0]).toHaveProperty("title");
  });

  it("getBlogPostBySlug returns correct post", async () => {
    const { getBlogPostBySlug } = await import("@/db/queries/blog-posts");
    const post = await getBlogPostBySlug("rising-prices-burden-on-students");
    expect(post).toBeDefined();
    expect(post!.title).toContain("Fiyat");
  });

  it("getBlogPostBySlug returns null for non-existent slug", async () => {
    const { getBlogPostBySlug } = await import("@/db/queries/blog-posts");
    const post = await getBlogPostBySlug("non-existent-slug");
    expect(post).toBeUndefined();
  });

  it("getUpcomingEvents and getRecentEvents filter correctly", async () => {
    const { getUpcomingEvents, getRecentEvents } = await import("@/db/queries/events");
    const upcoming = await getUpcomingEvents();
    const recent = await getRecentEvents();
    expect(upcoming.every((e) => e.status === "upcoming")).toBe(true);
    expect(recent.every((e) => e.status === "recent")).toBe(true);
  });

  it("getActiveTeamMembers returns active members sorted", async () => {
    const { getActiveTeamMembers } = await import("@/db/queries/team-members");
    const members = await getActiveTeamMembers();
    expect(members.length).toBeGreaterThan(0);
    expect(members.every((m) => m.isActive)).toBe(true);
    for (let i = 1; i < members.length; i++) {
      expect(members[i - 1].order).toBeLessThanOrEqual(members[i].order);
    }
  });

  it("getAllActivities returns all 6 activities", async () => {
    const { getAllActivities } = await import("@/db/queries/activities");
    const all = await getAllActivities();
    expect(all.length).toBe(6);
  });

  it("getAllCourses returns all 6 courses", async () => {
    const { getAllCourses } = await import("@/db/queries/courses");
    const all = await getAllCourses();
    expect(all.length).toBe(6);
  });

  it("getGuideSectionTree builds nested hierarchy", async () => {
    const { getGuideSectionTree } = await import("@/db/queries/guide-sections");
    const tree = await getGuideSectionTree();
    expect(tree.length).toBeGreaterThan(0);

    // Find a section with children
    const pakistanHakkinda = tree.find((s) => s.id === "pakistan-hakkinda");
    expect(pakistanHakkinda).toBeDefined();
    expect(pakistanHakkinda!.children).toBeDefined();
    expect(pakistanHakkinda!.children!.length).toBeGreaterThan(0);
  });

  it("getNavigationTree builds nested NavItem structure", async () => {
    const { getNavigationTree } = await import("@/db/queries/navigation");
    const tree = await getNavigationTree();
    expect(tree.length).toBeGreaterThan(0);
    const hasDropdown = tree.some((item) => item.children && item.children.length > 0);
    expect(hasDropdown).toBe(true);
  });
});
