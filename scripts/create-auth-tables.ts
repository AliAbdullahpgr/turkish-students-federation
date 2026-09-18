/**
 * Creates the tables added alongside the Clerk → better-auth migration.
 *
 *   npm run db:auth-tables
 *
 * Written as explicit `CREATE TABLE IF NOT EXISTS` rather than `drizzle-kit
 * push` on purpose: push diffs the whole schema against the live database and
 * will happily propose dropping or rewriting an existing content table if the
 * two have drifted. Everything here is purely additive, so it is safe to run
 * against production and safe to run twice.
 */
import { createClient } from "@libsql/client";

const statements = [
  `CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    email_verified INTEGER DEFAULT 0 NOT NULL,
    image TEXT,
    role TEXT DEFAULT 'user' NOT NULL,
    banned INTEGER DEFAULT 0 NOT NULL,
    ban_reason TEXT,
    ban_expires INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS user_email_idx ON user (email)`,

  `CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY NOT NULL,
    expires_at INTEGER NOT NULL,
    token TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    impersonated_by TEXT
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS session_token_idx ON session (token)`,
  `CREATE INDEX IF NOT EXISTS session_user_idx ON session (user_id)`,

  `CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY NOT NULL,
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at INTEGER,
    refresh_token_expires_at INTEGER,
    scope TEXT,
    password TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS account_user_idx ON account (user_id)`,

  `CREATE TABLE IF NOT EXISTS verification (
    id TEXT PRIMARY KEY NOT NULL,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verification (identifier)`,

  `CREATE TABLE IF NOT EXISTS social_accounts (
    id TEXT PRIMARY KEY NOT NULL,
    platform TEXT NOT NULL,
    label TEXT DEFAULT '' NOT NULL,
    url TEXT DEFAULT '' NOT NULL,
    active INTEGER DEFAULT 1 NOT NULL,
    open_in_new_tab INTEGER DEFAULT 1 NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS social_account_order_idx ON social_accounts (sort_order)`,
];

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) throw new Error("TURSO_DATABASE_URL is not set");

  const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });

  for (const sql of statements) {
    await client.execute(sql);
    const name = sql.match(/(?:TABLE|INDEX) IF NOT EXISTS (\w+)/)?.[1];
    console.log(`ok  ${name}`);
  }

  console.log("\nAuth and social tables are in place.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
