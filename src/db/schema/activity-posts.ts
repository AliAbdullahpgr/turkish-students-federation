import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { media } from "./media";

/**
 * Things the association actually did — "Yetimhane Ziyareti", "PTÖB Yıllık
 * Buluşması" — written up like news items.
 *
 * Distinct from the older `activities` table, which is a static icon list of
 * what the association does in general ("Seminerler", "Multimedya
 * Etkinlikleri") and carries no date, image or body.
 */
export const activityPosts = sqliteTable("activity_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").default(""),
  slug: text("slug").notNull().unique(),
  thumbnailMediaId: text("thumbnail_media_id").references(() => media.id),
  category: text("category"),
  location: text("location"),
  happenedAt: text("happened_at").default(sql`(datetime('now'))`),
  isPublished: integer("is_published", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at"),
});
