import { and, desc, eq, like, or } from "drizzle-orm";
import { db } from "@/db/client";
import { blogPosts, media } from "@/db/schema";

const blogPostSelection = {
  id: blogPosts.id,
  title: blogPosts.title,
  excerpt: blogPosts.excerpt,
  body: blogPosts.body,
  slug: blogPosts.slug,
  thumbnailMediaId: blogPosts.thumbnailMediaId,
  thumbnail: media.secureUrl,
  category: blogPosts.category,
  author: blogPosts.author,
  publishedAt: blogPosts.publishedAt,
  isFeatured: blogPosts.isFeatured,
  createdAt: blogPosts.createdAt,
  updatedAt: blogPosts.updatedAt,
};

export async function getAllBlogPosts() {
  return db
    .select(blogPostSelection)
    .from(blogPosts)
    .leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id))
    .orderBy(desc(blogPosts.publishedAt))
    .all();
}

export async function getFeaturedBlogPosts(limit = 6) {
  return db
    .select(blogPostSelection)
    .from(blogPosts)
    .leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id))
    .where(eq(blogPosts.isFeatured, true))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .all();
}

export async function getLatestBlogPosts(limit = 6) {
  return db
    .select(blogPostSelection)
    .from(blogPosts)
    .leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .all();
}

export async function getBlogPostBySlug(slug: string) {
  return db
    .select(blogPostSelection)
    .from(blogPosts)
    .leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id))
    .where(eq(blogPosts.slug, slug))
    .get();
}

export async function getBlogPostById(id: string) {
  return db
    .select(blogPostSelection)
    .from(blogPosts)
    .leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id))
    .where(eq(blogPosts.id, id))
    .get();
}

export async function searchBlogPosts(query: string, filterMonth?: string) {
  const conditions = [];

  if (query) {
    conditions.push(or(like(blogPosts.title, `%${query}%`), like(blogPosts.excerpt, `%${query}%`)));
  }

  if (filterMonth && filterMonth !== "all") {
    conditions.push(like(blogPosts.publishedAt, `${filterMonth}%`));
  }

  return db
    .select(blogPostSelection)
    .from(blogPosts)
    .leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(blogPosts.publishedAt))
    .all();
}
