import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const guideSections = sqliteTable("guide_sections", {
  id: text("id").primaryKey(),
  parentId: text("parent_id"),
  title: text("title").notNull(),
  content: text("content").default(""),
  level: integer("level").notNull(),
  sortOrder: integer("sort_order").default(0),
  isPublished: integer("is_published", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at"),
});
