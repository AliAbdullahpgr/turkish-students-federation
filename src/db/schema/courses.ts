import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { media } from "./media";

export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  instructor: text("instructor"),
  description: text("description"),
  thumbnailMediaId: text("thumbnail_media_id").references(() => media.id),
  href: text("href").default("#"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});
