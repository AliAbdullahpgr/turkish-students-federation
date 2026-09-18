import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { schema } from "@/db/schema";

type Database = ReturnType<typeof createDatabase>;

function createDatabase(url: string) {
  // The schema is handed to drizzle (rather than left off, as before) because
  // better-auth's drizzle adapter resolves its `user`/`session`/`account`/
  // `verification` models through it. Existing `db.select()` callers are
  // unaffected; `db.query.*` becomes available as a side effect.
  return drizzle(createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN }), {
    schema,
  });
}

let database: Database | null = null;

export function getDb(): Database {
  if (database) {
    return database;
  }

  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set");
  }

  database = createDatabase(url);

  return database;
}

export const db = new Proxy({} as Database, {
  get(_target, property, receiver) {
    return Reflect.get(getDb() as object, property, receiver);
  },
}) as Database;
