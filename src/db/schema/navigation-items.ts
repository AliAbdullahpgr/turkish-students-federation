import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const navigationItems = sqliteTable("navigation_items", {
  id: text("id").primaryKey(),
  parentId: text("parent_id"),
  label: text("label").notNull(),
  href: text("href").notNull(),
  sortOrder: integer("sort_order").default(0),
  isVisible: integer("is_visible", { mode: "boolean" }).default(true),
});
