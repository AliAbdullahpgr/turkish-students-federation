import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const activities = sqliteTable("activities", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  sortOrder: integer("sort_order").default(0),
});
