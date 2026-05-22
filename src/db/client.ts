import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

type Database = ReturnType<typeof drizzle>;

let database: Database | null = null;

export function getDb(): Database {
  if (database) {
    return database;
  }

  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set");
  }

  database = drizzle(createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }));

  return database;
}

export const db = new Proxy({} as Database, {
  get(_target, property, receiver) {
    return Reflect.get(getDb() as object, property, receiver);
  },
}) as Database;
