import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { activityPosts, media } from "@/db/schema";
import { staticFallbackOrThrow } from "@/db/queries/static-fallback";

export type ActivityPostItem = {
  id: string;
  title: string;
  excerpt: string;
  body: string | null;
  slug: string;
  thumbnailMediaId: string | null;
  thumbnail: string | null;
  category: string | null;
  location: string | null;
  happenedAt: string | null;
  isPublished: boolean | null;
  sortOrder: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

/**
 * There is no static stand-in for activities on purpose. The section only
 * renders once an activity exists, so an empty list during an outage hides the
 * section rather than showing invented events the association never held.
 */
const noActivities: ActivityPostItem[] = [];

const activityPostSelection = {
  id: activityPosts.id,
  title: activityPosts.title,
  excerpt: activityPosts.excerpt,
  body: activityPosts.body,
  slug: activityPosts.slug,
  thumbnailMediaId: activityPosts.thumbnailMediaId,
  thumbnail: media.secureUrl,
  category: activityPosts.category,
  location: activityPosts.location,
  happenedAt: activityPosts.happenedAt,
  isPublished: activityPosts.isPublished,
  sortOrder: activityPosts.sortOrder,
  createdAt: activityPosts.createdAt,
  updatedAt: activityPosts.updatedAt,
};

/** Everything, including unpublished — for the admin list. */
export async function getAllActivityPosts(): Promise<ActivityPostItem[]> {
  try {
    return await db
      .select(activityPostSelection)
      .from(activityPosts)
      .leftJoin(media, eq(activityPosts.thumbnailMediaId, media.id))
      .orderBy(desc(activityPosts.happenedAt))
      .all();
  } catch (error) {
    return staticFallbackOrThrow(error, noActivities);
  }
}

/** What the public site renders. */
export async function getPublishedActivityPosts(limit?: number): Promise<ActivityPostItem[]> {
  try {
    const rows = await db
      .select(activityPostSelection)
      .from(activityPosts)
      .leftJoin(media, eq(activityPosts.thumbnailMediaId, media.id))
      .where(eq(activityPosts.isPublished, true))
      .orderBy(desc(activityPosts.happenedAt))
      .all();

    return limit ? rows.slice(0, limit) : rows;
  } catch (error) {
    return staticFallbackOrThrow(error, noActivities);
  }
}

export async function getActivityPostById(id: string): Promise<ActivityPostItem | undefined> {
  try {
    return await db
      .select(activityPostSelection)
      .from(activityPosts)
      .leftJoin(media, eq(activityPosts.thumbnailMediaId, media.id))
      .where(eq(activityPosts.id, id))
      .get();
  } catch (error) {
    return staticFallbackOrThrow(error, undefined);
  }
}

export async function getActivityPostBySlug(slug: string): Promise<ActivityPostItem | undefined> {
  try {
    return await db
      .select(activityPostSelection)
      .from(activityPosts)
      .leftJoin(media, eq(activityPosts.thumbnailMediaId, media.id))
      .where(and(eq(activityPosts.slug, slug), eq(activityPosts.isPublished, true)))
      .get();
  } catch (error) {
    return staticFallbackOrThrow(error, undefined);
  }
}
