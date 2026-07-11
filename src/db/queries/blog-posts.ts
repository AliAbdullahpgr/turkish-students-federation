import { and, desc, eq, like, or } from "drizzle-orm";
import { db } from "@/db/client";
import { blogPosts, media } from "@/db/schema";
import { guideBlogPosts } from "@/data/guideBlogPosts";

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
  const posts = await db
    .select(blogPostSelection)
    .from(blogPosts)
    .leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id))
    .orderBy(desc(blogPosts.publishedAt))
    .all();
  return [...posts, ...guideBlogPosts.filter((guide) => !posts.some((post) => post.slug === guide.slug))];
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
  const posts = await db
    .select(blogPostSelection)
    .from(blogPosts)
    .leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id))
    .orderBy(desc(blogPosts.publishedAt))
    .all();
  return [...posts, ...guideBlogPosts.filter((guide) => !posts.some((post) => post.slug === guide.slug))]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, limit);
}

export async function getBlogPostBySlug(slug: string) {
  const post = await db
    .select(blogPostSelection)
    .from(blogPosts)
    .leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id))
    .where(eq(blogPosts.slug, slug))
    .get();
  return post ?? guideBlogPosts.find((guide) => guide.slug === slug);
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

  const posts = await db
    .select(blogPostSelection)
    .from(blogPosts)
    .leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(blogPosts.publishedAt))
    .all();
  const normalizedQuery = query.toLocaleLowerCase("tr");
  const matchingGuidePosts = guideBlogPosts.filter((post) => {
    const matchesQuery = !normalizedQuery || `${post.title} ${post.excerpt}`.toLocaleLowerCase("tr").includes(normalizedQuery);
    const matchesMonth = !filterMonth || filterMonth === "all" || post.publishedAt.startsWith(filterMonth);
    return matchesQuery && matchesMonth && !posts.some((item) => item.slug === post.slug);
  });
  return [...posts, ...matchingGuidePosts];
}
