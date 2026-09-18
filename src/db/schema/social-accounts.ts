import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Social profiles shown in the footer and header.
 *
 * These used to be a hardcoded array in `Footer.tsx`, where Instagram and
 * YouTube were both `href: "#"` — there was no way to point them anywhere
 * without a code change. Keeping them as rows makes the platform list
 * open-ended and the display order editable, so adding a sixth network is
 * data entry rather than a deploy.
 */
export const socialAccounts = sqliteTable(
  "social_accounts",
  {
    id: text("id").primaryKey(),
    /** Chooses the icon; unrecognised values fall back to a generic link icon. */
    platform: text("platform").notNull(),
    /** Accessible name. Falls back to the platform when blank. */
    label: text("label").default("").notNull(),
    url: text("url").default("").notNull(),
    active: integer("active", { mode: "boolean" }).default(true).notNull(),
    openInNewTab: integer("open_in_new_tab", { mode: "boolean" }).default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: text("created_at").default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").default(sql`(datetime('now'))`),
  },
  (table) => [index("social_account_order_idx").on(table.sortOrder)],
);
