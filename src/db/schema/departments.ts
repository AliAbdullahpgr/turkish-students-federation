import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { media } from "./media";

/*
  Members and gallery are ordered lists edited together with the department, so
  they live on the row as JSON text. One save replaces the whole page
  atomically; the shapes are `DepartmentMember[]` / `DepartmentGalleryItem[]`
  in `@/db/queries/departments`.
*/
export const departments = sqliteTable("departments", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  summary: text("summary").notNull().default(""),
  body: text("body").default(""),
  icon: text("icon").notNull().default(""),
  heroMediaId: text("hero_media_id").references(() => media.id),
  members: text("members").notNull().default("[]"),
  gallery: text("gallery").notNull().default("[]"),
  isPublished: integer("is_published", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at"),
});
