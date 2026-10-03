import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setupSchema, closeHarness, testClient } from "./helpers/admin-harness";

/*
  Before migrations/002_departments.sql has been applied to a database, the
  public pages must keep working from the static list rather than 500.
*/

let queries: typeof import("@/db/queries/departments");

beforeAll(async () => {
  await setupSchema();
  await testClient.execute("DROP TABLE departments");
  queries = await import("@/db/queries/departments");
});

afterAll(closeHarness);

describe("departments table not migrated yet", () => {
  it("lists the six static departments and resolves one by slug", async () => {
    const list = await queries.getPublishedDepartments();
    expect(list).toHaveLength(6);
    expect((await queries.getDepartmentBySlug("medya-yayinlar"))?.name).toBe("Medya & Yayınlar");
    expect(await queries.getDepartmentBySlug("yok-boyle-bir-birim")).toBeUndefined();
  });
});
