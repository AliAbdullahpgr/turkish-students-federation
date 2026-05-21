import { db } from "@/db/client";
import { blogPosts } from "@/db/schema";
import { eq, desc, and, like, or } from "drizzle-orm";

export async function getAllBlogPosts() {
  return db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.publishedAt))
    .all();
}

export async function getFeaturedBlogPosts(limit = 6) {
  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isFeatured, true))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .all();
}

export async function getLatestBlogPosts(limit = 6) {
  return db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .all();
}

export async function getBlogPostBySlug(slug: string) {
  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .get();
}

export async function getBlogPostById(id: string) {
  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .get();
}

export async function searchBlogPosts(query: string, filterMonth?: string) {
  const conditions = [];

  if (query) {
    conditions.push(
      or(
        like(blogPosts.title, `%${query}%`),
        like(blogPosts.excerpt, `%${query}%`)
      )
    );
  }

  if (filterMonth && filterMonth !== "all") {
    conditions.push(like(blogPosts.publishedAt, `${filterMonth}%`));
  }

  return db
    .select()
    .from(blogPosts)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(blogPosts.publishedAt))
    .all();
}
