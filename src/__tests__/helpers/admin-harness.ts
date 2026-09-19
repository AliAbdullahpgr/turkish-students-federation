import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";
import { NextRequest } from "next/server";
import { vi } from "vitest";

/*
  Shared harness for the admin-panel round-trip tests.

  Every test built on this writes through a real admin route handler and reads
  back through the real public query functions the public pages call, against a
  real libSQL database. Nothing here is a stub except `next/cache`.

  Two things have to happen before anything imports `@/db/client`, which is why
  they are module-level side effects rather than a function a test could forget
  to call:

    - `TURSO_DATABASE_URL` is repointed at a throwaway file. That module reads
      the URL lazily on first access and memoises the connection, and the repo's
      `.env` points at the *production* database, so this override is the only
      thing keeping these suites off live site content.
    - `ADMIN_AUTH_BYPASS=1` turns on the existing non-production hatch in
      `src/lib/auth-guard.ts`, so handlers pass their admin gate without a
      better-auth session (and without `next/headers`, which has no request
      scope under vitest).

  Import this module *statically* at the top of a test file, and import route
  handlers *dynamically* inside `beforeAll`, so this ordering holds.
*/

const tempDir = mkdtempSync(path.join(tmpdir(), "admin-harness-"));

process.env.TURSO_DATABASE_URL = "file:" + path.join(tempDir, "test.db").replace(/\\/g, "/");
delete process.env.TURSO_AUTH_TOKEN;
process.env.ADMIN_AUTH_BYPASS = "1";

/**
 * Paths the handlers asked Next to revalidate, newest last.
 *
 * `revalidatePath` throws outside a request scope, so it has to be replaced
 * regardless. Recording the calls turns that necessity into an assertion: a
 * mutating route that forgets to revalidate leaves the public page serving
 * stale content, which no amount of correct database writing would reveal.
 */
export const revalidatedPaths: string[] = [];

vi.mock("next/cache", () => ({
  revalidatePath: (p: string, type?: string) => {
    revalidatedPaths.push(type ? `${p} (${type})` : p);
  },
  revalidateTag: (tag: string) => {
    revalidatedPaths.push(`tag:${tag}`);
  },
  unstable_cache: <T>(fn: T) => fn,
}));

export function clearRevalidations() {
  revalidatedPaths.length = 0;
}

export const testClient: Client = createClient({ url: process.env.TURSO_DATABASE_URL! });

/*
  DDL for the test database.

  Written out rather than generated from the drizzle metadata so that defaults
  and CHECK constraints are exactly what production has, with no rendering layer
  to get them subtly wrong. `schema-drift.test.ts` compares these tables against
  the drizzle schema column by column, so this cannot silently fall behind.
*/
const DDL = [
  `CREATE TABLE media (
    id TEXT PRIMARY KEY,
    cloudinary_public_id TEXT NOT NULL,
    url TEXT NOT NULL,
    secure_url TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    format TEXT,
    resource_type TEXT,
    alt_text TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    body TEXT DEFAULT '',
    slug TEXT NOT NULL UNIQUE,
    thumbnail_media_id TEXT REFERENCES media(id),
    category TEXT,
    author TEXT,
    published_at TEXT DEFAULT (datetime('now')),
    is_featured INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT
  )`,
  `CREATE TABLE activity_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    body TEXT DEFAULT '',
    slug TEXT NOT NULL UNIQUE,
    thumbnail_media_id TEXT REFERENCES media(id),
    category TEXT,
    location TEXT,
    happened_at TEXT DEFAULT (datetime('now')),
    is_published INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT
  )`,
  `CREATE TABLE events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    poster_media_id TEXT REFERENCES media(id),
    category TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming',
    date TEXT,
    location TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    photo_media_id TEXT REFERENCES media(id),
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    instructor TEXT,
    description TEXT,
    thumbnail_media_id TEXT REFERENCES media(id),
    href TEXT DEFAULT '#',
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE activities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  )`,
  `CREATE TABLE guide_sections (
    id TEXT PRIMARY KEY,
    parent_id TEXT,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    level INTEGER NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT
  )`,
  `CREATE TABLE navigation_items (
    id TEXT PRIMARY KEY,
    parent_id TEXT,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1
  )`,
  `CREATE TABLE contact_submissions (
    id TEXT PRIMARY KEY NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('contact', 'membership')),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    metadata TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE social_accounts (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    label TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT '',
    active INTEGER NOT NULL DEFAULT 1,
    open_in_new_tab INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX social_account_order_idx ON social_accounts (sort_order)`,
];

/** Every content table, in an order safe to delete from (children first). */
export const CONTENT_TABLES = [
  "blog_posts",
  "activity_posts",
  "events",
  "team_members",
  "courses",
  "activities",
  "guide_sections",
  "navigation_items",
  "contact_submissions",
  "social_accounts",
  "site_settings",
  "media",
];

export async function setupSchema() {
  for (const statement of DDL) {
    await testClient.execute(statement);
  }
}

export async function resetTables() {
  for (const table of CONTENT_TABLES) {
    await testClient.execute(`DELETE FROM ${table}`);
  }
  clearRevalidations();
}

export async function closeHarness() {
  testClient.close();

  // The handlers opened their own connection through `@/db/client`; Windows
  // will not unlink the file while any handle is open.
  const { db } = await import("@/db/client");
  (db as unknown as { $client: Client }).$client.close();

  try {
    rmSync(tempDir, { recursive: true, force: true });
  } catch {
    // A leftover temp directory is not worth failing a green run over.
  }
}

/** A JSON request aimed at an admin route. */
export function jsonRequest(method: string, body?: unknown, url = "http://localhost/api/admin/test") {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

/** Next 15 hands dynamic segments to a handler as a promise. */
export function routeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

/** Insert a media row directly and return its id — the fixture for image fields. */
export async function seedMedia(publicId = "fixture", secureUrl?: string) {
  const id = `media-${publicId}-${Math.random().toString(36).slice(2, 8)}`;
  const url = secureUrl ?? `https://res.cloudinary.com/test/image/upload/${publicId}.jpg`;
  await testClient.execute({
    sql: "INSERT INTO media (id, cloudinary_public_id, url, secure_url, width, height, format, resource_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    args: [id, publicId, url, url, 1200, 800, "jpg", "image"],
  });
  return { id, secureUrl: url };
}

export async function countRows(table: string) {
  const result = await testClient.execute(`SELECT COUNT(*) AS n FROM ${table}`);
  return Number(result.rows[0].n);
}

/** Read a response body as JSON, with the status attached for easy assertions. */
export async function readJson(res: Response) {
  return { status: res.status, body: await res.json() };
}
