import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { media } from "./media";

export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").default(""),
  slug: text("slug").notNull().unique(),
  thumbnailMediaId: text("thumbnail_media_id").references(() => media.id),
  category: text("category"),
  author: text("author"),
  publishedAt: text("published_at").default(sql`(datetime('now'))`),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at"),
});
