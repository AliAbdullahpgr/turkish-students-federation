import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { media } from "./media";

export const teamMembers = sqliteTable("team_members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  photoMediaId: text("photo_media_id").references(() => media.id),
  order: integer("order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});
