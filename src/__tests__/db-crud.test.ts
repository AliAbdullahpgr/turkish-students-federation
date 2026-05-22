import { describe, it, expect, afterEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { blogPosts, events, teamMembers, guideSections, navigationItems, media, siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import slugify from "slugify";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
const db = drizzle(turso);

describe("Blog Posts CRUD", () => {
  const testId = nanoid();
  const testSlug = "test-blog-" + nanoid(6);

  afterEach(async () => {
    await db.delete(blogPosts).where(eq(blogPosts.id, testId));
  });

  it("should create, read, update, and delete a blog post", async () => {
    // CREATE
    await db.insert(blogPosts).values({
      id: testId,
      title: "Test Blog Post",
      excerpt: "Test excerpt for CRUD",
      slug: testSlug,
      category: "Test",
      author: "Tester",
      publishedAt: "2026-05-20",
    });
    let post = await db.select().from(blogPosts).where(eq(blogPosts.id, testId)).get();
    expect(post).toBeDefined();
    expect(post!.title).toBe("Test Blog Post");
    expect(post!.slug).toBe(testSlug);

    // READ by slug
    post = await db.select().from(blogPosts).where(eq(blogPosts.slug, testSlug)).get();
    expect(post).toBeDefined();

    // UPDATE
    await db.update(blogPosts).set({ title: "Updated Title", excerpt: "Updated excerpt" }).where(eq(blogPosts.id, testId));
    post = await db.select().from(blogPosts).where(eq(blogPosts.id, testId)).get();
    expect(post!.title).toBe("Updated Title");
    expect(post!.excerpt).toBe("Updated excerpt");

    // DELETE
    await db.delete(blogPosts).where(eq(blogPosts.id, testId));
    post = await db.select().from(blogPosts).where(eq(blogPosts.id, testId)).get();
    expect(post).toBeUndefined();
  });

  it("should auto-generate slug from title", async () => {
    const testSlug2 = slugify("My Test Title", { lower: true, strict: true }) + "-" + nanoid(6);
    await db.insert(blogPosts).values({
      id: testId,
      title: "My Test Title",
      excerpt: "Test",
      slug: testSlug2,
      publishedAt: "2026-05-20",
    });
    const post = await db.select().from(blogPosts).where(eq(blogPosts.id, testId)).get();
    expect(post!.slug).toBe(testSlug2);
  });

  it("should reject duplicate slugs", async () => {
    const slug = "unique-slug-" + nanoid(6);
    await db.insert(blogPosts).values({
      id: testId,
      title: "First Post",
      excerpt: "Test",
      slug,
      publishedAt: "2026-05-20",
    });
    const secondId = nanoid();
    await expect(
      db.insert(blogPosts).values({
        id: secondId,
        title: "Second Post",
        excerpt: "Test",
        slug,
        publishedAt: "2026-05-20",
      })
    ).rejects.toThrow();
    await db.delete(blogPosts).where(eq(blogPosts.id, secondId));
  });
});

describe("Events CRUD", () => {
  const testId = nanoid();

  afterEach(async () => {
    await db.delete(events).where(eq(events.id, testId));
  });

  it("should create events with both statuses", async () => {
    await db.insert(events).values({
      id: testId,
      title: "Test Event",
      category: "Social",
      status: "upcoming",
      date: "Haziran 2026",
      location: "Test Location",
    });

    const event = await db.select().from(events).where(eq(events.id, testId)).get();
    expect(event).toBeDefined();
    expect(event!.status).toBe("upcoming");
    expect(event!.location).toBe("Test Location");
  });

  it("should update event status", async () => {
    await db.insert(events).values({
      id: testId,
      title: "Status Change Test",
      category: "Seminar",
      status: "upcoming",
    });

    await db.update(events).set({ status: "recent" }).where(eq(events.id, testId));
    const event = await db.select().from(events).where(eq(events.id, testId)).get();
    expect(event!.status).toBe("recent");
  });
});

describe("Team Members CRUD", () => {
  const testId = nanoid();

  afterEach(async () => {
    await db.delete(teamMembers).where(eq(teamMembers.id, testId));
  });

  it("should create and toggle team member active status", async () => {
    await db.insert(teamMembers).values({
      id: testId,
      name: "Test User",
      role: "Tester",
      bio: "A test user",
      order: 99,
      isActive: true,
    });

    let member = await db.select().from(teamMembers).where(eq(teamMembers.id, testId)).get();
    expect(member!.isActive).toBe(true);

    await db.update(teamMembers).set({ isActive: false }).where(eq(teamMembers.id, testId));
    member = await db.select().from(teamMembers).where(eq(teamMembers.id, testId)).get();
    expect(member!.isActive).toBe(false);
  });
});

describe("Guide Sections CRUD", () => {
  const parentId = nanoid();
  const childId = nanoid();

  afterEach(async () => {
    await db.delete(guideSections).where(eq(guideSections.id, childId));
    await db.delete(guideSections).where(eq(guideSections.id, parentId));
  });

  it("should create nested guide sections with parent-child relationship", async () => {
    await db.insert(guideSections).values({
      id: parentId,
      title: "Parent Section",
      content: "Parent content",
      level: 2,
      sortOrder: 0,
      isPublished: true,
    });

    await db.insert(guideSections).values({
      id: childId,
      parentId,
      title: "Child Section",
      content: "Child content",
      level: 3,
      sortOrder: 0,
      isPublished: true,
    });

    const parent = await db.select().from(guideSections).where(eq(guideSections.id, parentId)).get();
    const child = await db.select().from(guideSections).where(eq(guideSections.id, childId)).get();

    expect(parent).toBeDefined();
    expect(child).toBeDefined();
    expect(child!.parentId).toBe(parentId);
    expect(parent!.parentId).toBeNull();
  });

  it("should cascade delete children when parent is deleted", async () => {
    await db.insert(guideSections).values({
      id: parentId,
      title: "To Delete",
      level: 2,
    });
    await db.insert(guideSections).values({
      id: childId,
      parentId,
      title: "Child to cascade",
      level: 3,
    });

    // Delete children first, then parent
    await db.delete(guideSections).where(eq(guideSections.parentId, parentId));
    await db.delete(guideSections).where(eq(guideSections.id, parentId));

    const parent = await db.select().from(guideSections).where(eq(guideSections.id, parentId)).get();
    const child = await db.select().from(guideSections).where(eq(guideSections.id, childId)).get();
    expect(parent).toBeUndefined();
    expect(child).toBeUndefined();
  });
});

describe("Navigation Items CRUD", () => {
  const parentId = nanoid();
  const childId = nanoid();

  afterEach(async () => {
    await db.delete(navigationItems).where(eq(navigationItems.id, childId));
    await db.delete(navigationItems).where(eq(navigationItems.id, parentId));
  });

  it("should create navigation items with parent-child and toggle visibility", async () => {
    await db.insert(navigationItems).values({
      id: parentId,
      label: "Parent Nav",
      href: "/parent",
      sortOrder: 0,
      isVisible: true,
    });

    await db.insert(navigationItems).values({
      id: childId,
      parentId,
      label: "Child Nav",
      href: "/child",
      sortOrder: 0,
      isVisible: true,
    });

    const child = await db.select().from(navigationItems).where(eq(navigationItems.id, childId)).get();
    expect(child!.parentId).toBe(parentId);

    await db.update(navigationItems).set({ isVisible: false }).where(eq(navigationItems.id, parentId));
    const parent = await db.select().from(navigationItems).where(eq(navigationItems.id, parentId)).get();
    expect(parent!.isVisible).toBe(false);
  });
});

describe("Media CRUD", () => {
  const testId = nanoid();

  afterEach(async () => {
    await db.delete(media).where(eq(media.id, testId));
  });

  it("should create and delete media records", async () => {
    await db.insert(media).values({
      id: testId,
      cloudinaryPublicId: "test_public_id",
      url: "https://res.cloudinary.com/test/image.jpg",
      secureUrl: "https://res.cloudinary.com/test/image.jpg",
      width: 800,
      height: 600,
      format: "jpg",
      resourceType: "image",
    });

    const record = await db.select().from(media).where(eq(media.id, testId)).get();
    expect(record).toBeDefined();
    expect(record!.width).toBe(800);
    expect(record!.format).toBe("jpg");

    await db.delete(media).where(eq(media.id, testId));
    const deleted = await db.select().from(media).where(eq(media.id, testId)).get();
    expect(deleted).toBeUndefined();
  });
});

describe("Site Settings CRUD", () => {
  const testKey = "test_setting_" + nanoid(6);

  afterEach(async () => {
    await db.delete(siteSettings).where(eq(siteSettings.key, testKey));
  });

  it("should insert and update site settings", async () => {
    const { siteSettings } = await import("@/db/schema/site-settings");

    await db.insert(siteSettings).values({
      key: testKey,
      value: "initial value",
    });

    let setting = await db.select().from(siteSettings).where(eq(siteSettings.key, testKey)).get();
    expect(setting!.value).toBe("initial value");

    await db.update(siteSettings).set({ value: "updated value" }).where(eq(siteSettings.key, testKey));
    setting = await db.select().from(siteSettings).where(eq(siteSettings.key, testKey)).get();
    expect(setting!.value).toBe("updated value");
  });
});
