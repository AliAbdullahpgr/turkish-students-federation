import { db } from "@/db/client";
import { blogPosts } from "@/db/schema";
import { eq, desc, and, or, like } from "drizzle-orm";
import { resolveMediaUrls } from "./resolve-media";

export async function getAllBlogPosts() {
  const rows = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.publishedAt))
    .all();
  return resolveMediaUrls(rows, "thumbnailMediaId", "thumbnail");
}

export async function getFeaturedBlogPosts(limit = 6) {
  const rows = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isFeatured, true))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .all();
  return resolveMediaUrls(rows, "thumbnailMediaId", "thumbnail");
}

export async function getLatestBlogPosts(limit = 6) {
  const rows = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .all();
  return resolveMediaUrls(rows, "thumbnailMediaId", "thumbnail");
}

export async function getBlogPostBySlug(slug: string) {
  const row = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .get();
  if (!row) return null;
  return row;
}

export async function getBlogPostById(id: string) {
  const row = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .get();
  if (!row) return null;
  return row;
}

export async function searchBlogPosts(query: string, filterMonth?: string) {
  const conditions = [];

  if (query) {
    conditions.push(
      or(like(blogPosts.title, `%${query}%`), like(blogPosts.excerpt, `%${query}%`))
    );
  }

  if (filterMonth && filterMonth !== "all") {
    conditions.push(like(blogPosts.publishedAt, `${filterMonth}%`));
  }

  const rows = await db
    .select()
    .from(blogPosts)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(blogPosts.publishedAt))
    .all();
  return resolveMediaUrls(rows, "thumbnailMediaId", "thumbnail");
}
