import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getTableConfig } from "drizzle-orm/sqlite-core";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { schema } from "@/db/schema";
import { setupSchema, closeHarness, testClient, CONTENT_TABLES } from "./helpers/admin-harness";

/*
  The test harness creates its tables from hand-written DDL so that defaults and
  CHECK constraints are exactly what production has. That is only safe if it
  cannot drift from the drizzle schema, which is what this file enforces: add a
  column to a schema file and forget the harness, and these fail.

  better-auth owns `user`/`session`/`account`/`verification` and creates them
  with its own migration, so they are deliberately outside the harness.

  `@/db/schema` is imported statically on purpose: it declares tables and
  relations only, and never reaches for `@/db/client`, so reading it here does
  not open a database connection.
*/

const AUTH_TABLES = new Set(["user", "session", "account", "verification"]);

const contentTables: [string, SQLiteTable][] = Object.values(schema)
  .map((table) => table as SQLiteTable)
  .filter((table) => !AUTH_TABLES.has(getTableConfig(table).name))
  .map((table) => [getTableConfig(table).name, table]);

beforeAll(setupSchema);
afterAll(closeHarness);

async function actualColumns(tableName: string) {
  const info = await testClient.execute(`PRAGMA table_info(${tableName})`);
  return new Set(info.rows.map((row) => String((row as unknown as { name: string }).name)));
}

describe("test harness schema matches the drizzle schema", () => {
  it("creates exactly the non-auth tables the schema defines", () => {
    expect([...CONTENT_TABLES].sort()).toEqual(contentTables.map(([name]) => name).sort());
  });

  it("every table the harness lists really exists in the test database", async () => {
    const tables = await testClient.execute(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
    );
    const present = new Set(tables.rows.map((row) => String((row as unknown as { name: string }).name)));
    for (const table of CONTENT_TABLES) {
      expect(present.has(table), `missing table ${table}`).toBe(true);
    }
  });

  for (const [tableName, table] of contentTables) {
    it(`${tableName} has exactly the columns the schema declares`, async () => {
      const declared = getTableConfig(table).columns.map((column) => column.name);
      const actual = await actualColumns(tableName);

      for (const column of declared) {
        expect(actual.has(column), `${tableName}.${column} missing from harness DDL`).toBe(true);
      }
      expect(actual.size, `${tableName} has columns the schema does not declare`).toBe(declared.length);
    });
  }
});
