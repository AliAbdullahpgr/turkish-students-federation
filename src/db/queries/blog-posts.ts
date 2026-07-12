import { and, desc, eq, like, or } from "drizzle-orm";
import { db } from "@/db/client";
import { blogPosts, media } from "@/db/schema";
import { guideBlogPosts } from "@/data/guideBlogPosts";
import { blogPosts as fallbackBlogPosts } from "@/data/blogs";
import { staticFallbackOrThrow } from "@/db/queries/static-fallback";

const blogFallbacks = fallbackBlogPosts.map((post) => ({
  id: post.id,
  title: post.title,
  excerpt: post.excerpt,
  body: "",
  slug: post.slug,
  thumbnailMediaId: null,
  thumbnail: post.thumbnail || null,
  category: post.category || "Blog",
  author: post.author || null,
  publishedAt: post.dateISO,
  isFeatured: false,
  createdAt: post.dateISO,
  updatedAt: null,
}));

const allFallbackPosts = [...blogFallbacks, ...guideBlogPosts];

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
  try {
    return await db.select(blogPostSelection).from(blogPosts).leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id)).orderBy(desc(blogPosts.publishedAt)).all();
  } catch (error) {
    return staticFallbackOrThrow(error, allFallbackPosts);
  }
}

export async function getFeaturedBlogPosts(limit = 6) {
  try { return await db
    .select(blogPostSelection)
    .from(blogPosts)
    .leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id))
    .where(eq(blogPosts.isFeatured, true))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .all(); } catch (error) { return staticFallbackOrThrow(error, allFallbackPosts.filter((post) => post.isFeatured).slice(0, limit)); }
}

export async function getLatestBlogPosts(limit = 6) {
  try {
    return await db.select(blogPostSelection).from(blogPosts).leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id)).orderBy(desc(blogPosts.publishedAt)).limit(limit).all();
  } catch (error) {
    return staticFallbackOrThrow(
      error,
      allFallbackPosts
        .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
        .slice(0, limit),
    );
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await db.select(blogPostSelection).from(blogPosts).leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id)).where(eq(blogPosts.slug, slug)).get();
    return post;
  } catch (error) {
    return staticFallbackOrThrow(error, allFallbackPosts.find((fallback) => fallback.slug === slug));
  }
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

  let posts;
  try {
    posts = await db.select(blogPostSelection).from(blogPosts).leftJoin(media, eq(blogPosts.thumbnailMediaId, media.id)).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(blogPosts.publishedAt)).all();
  } catch (error) {
    return staticFallbackOrThrow(error, allFallbackPosts.filter((post) => {
      const normalized = query.toLocaleLowerCase("tr");
      return (!normalized || `${post.title} ${post.excerpt}`.toLocaleLowerCase("tr").includes(normalized)) && (!filterMonth || filterMonth === "all" || post.publishedAt.startsWith(filterMonth));
    }));
  }
  return posts;
}
