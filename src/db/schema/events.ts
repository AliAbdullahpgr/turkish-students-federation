import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { media } from "./media";

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  posterMediaId: text("poster_media_id").references(() => media.id),
  category: text("category"),
  status: text("status", { enum: ["upcoming", "recent"] }).notNull().default("upcoming"),
  date: text("date"),
  location: text("location"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});
