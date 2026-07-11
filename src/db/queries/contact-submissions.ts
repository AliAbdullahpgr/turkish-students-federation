import { desc, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { contactSubmissions } from "@/db/schema";

let tableReady: Promise<void> | null = null;

export function ensureContactSubmissionsTable() {
  if (!tableReady) {
    tableReady = db.run(sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id TEXT PRIMARY KEY NOT NULL,
        kind TEXT NOT NULL CHECK (kind IN ('contact', 'membership')),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        metadata TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `).then(() => undefined).catch((error) => {
      tableReady = null;
      throw error;
    });
  }

  return tableReady;
}

export async function getContactSubmissions() {
  await ensureContactSubmissionsTable();
  return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).all();
}
