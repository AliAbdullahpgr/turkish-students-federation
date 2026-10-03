import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import {
  ApiInputError,
  apiErrorResponse,
  boolean,
  integer,
  optionalText,
  readJsonObject,
  requiredText,
} from "@/lib/api-validation";
import { parseDepartmentInput } from "@/lib/department-input";

const request = (body: string, headers: Record<string, string> = {}) =>
  new NextRequest("http://localhost/api/admin/test", { method: "POST", body, headers });

describe("field validators", () => {
  it("requiredText trims, truncates and rejects blanks and non-strings", () => {
    expect(requiredText({ a: "  x  " }, "a")).toBe("x");
    expect(requiredText({ a: "abcdef" }, "a", 3)).toBe("abc");
    expect(() => requiredText({ a: "   " }, "a")).toThrow(ApiInputError);
    expect(() => requiredText({ a: 5 }, "a")).toThrow(ApiInputError);
    expect(() => requiredText({}, "a")).toThrow(/a is required/);
  });

  it("optionalText returns null for blank or non-string input", () => {
    expect(optionalText({ a: "  " }, "a")).toBeNull();
    expect(optionalText({ a: 3 }, "a")).toBeNull();
    expect(optionalText({ a: " ok " }, "a")).toBe("ok");
  });

  it("integer applies the fallback and enforces the range", () => {
    expect(integer({}, "n")).toBe(0);
    expect(integer({ n: "" }, "n", 7)).toBe(7);
    expect(integer({ n: 5 }, "n")).toBe(5);
    expect(() => integer({ n: 1.5 }, "n")).toThrow(ApiInputError);
    expect(() => integer({ n: -1 }, "n")).toThrow(ApiInputError);
    expect(() => integer({ n: "5" }, "n")).toThrow(ApiInputError);
  });

  it("boolean accepts only real booleans", () => {
    expect(boolean({}, "b", true)).toBe(true);
    expect(boolean({ b: false }, "b", true)).toBe(false);
    expect(() => boolean({ b: "false" }, "b", true)).toThrow(ApiInputError);
  });
});

describe("readJsonObject", () => {
  it("parses an object and rejects arrays, scalars and malformed JSON with 400", async () => {
    expect(await readJsonObject(request('{"a":1}'))).toEqual({ a: 1 });
    for (const bad of ["[]", "5", "null", "{oops"]) {
      await expect(readJsonObject(request(bad))).rejects.toMatchObject({ status: 400 });
    }
  });

  it("rejects an oversized body with 413", async () => {
    await expect(readJsonObject(request("{}", { "content-length": "999999" }))).rejects.toMatchObject({
      status: 413,
    });
  });
});

describe("apiErrorResponse", () => {
  it("maps input errors to their status, wrapped unique violations to 409, anything else to 503", async () => {
    expect((await apiErrorResponse(new ApiInputError("bad", 400))).status).toBe(400);
    const wrapped = new Error("Failed query: insert", { cause: { code: "SQLITE_CONSTRAINT_UNIQUE" } });
    expect((await apiErrorResponse(wrapped)).status).toBe(409);
    expect((await apiErrorResponse(new Error("boom"))).status).toBe(503);
  });
});

describe("parseDepartmentInput slug", () => {
  it("builds a Turkish-friendly slug from the name and drops '&' instead of spelling it 'and'", () => {
    expect(parseDepartmentInput({ name: "Medya & Yayınlar" }).slug).toBe("medya-yayinlar");
    expect(parseDepartmentInput({ name: "Araştırma & Geliştirme" }).slug).toBe("arastirma-gelistirme");
  });

  it("prefers an explicit slug and falls back to a generated one for symbol-only names", () => {
    expect(parseDepartmentInput({ name: "X", slug: "Özel Adres" }).slug).toBe("ozel-adres");
    expect(parseDepartmentInput({ name: "***" }).slug).toMatch(/^birim-/);
  });
});
