import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  cloudinaryPublicId: text("cloudinary_public_id").notNull(),
  url: text("url").notNull(),
  secureUrl: text("secure_url").notNull(),
  width: integer("width"),
  height: integer("height"),
  format: text("format"),
  resourceType: text("resource_type"),
  altText: text("alt_text"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});
