import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { staticFallbackOrThrow } from "@/db/queries/static-fallback";

/**
 * These pin the rule that keeps the public site up during a Turso blip while
 * still surfacing real query bugs. Getting this backwards in either direction
 * is expensive: throw on an outage and every page 500s; swallow a schema error
 * and the site quietly serves placeholder copy forever.
 */

const FALLBACK = { marker: "static" } as const;

describe("staticFallbackOrThrow", () => {
  const original = process.env.TURSO_DATABASE_URL;
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
    if (original === undefined) delete process.env.TURSO_DATABASE_URL;
    else process.env.TURSO_DATABASE_URL = original;
  });

  describe("with no database configured", () => {
    beforeEach(() => {
      delete process.env.TURSO_DATABASE_URL;
    });

    it("returns the fallback for any error, so local setup works offline", () => {
      expect(staticFallbackOrThrow(new Error("no such column: foo"), FALLBACK)).toBe(FALLBACK);
    });
  });

  describe("with a database configured", () => {
    beforeEach(() => {
      process.env.TURSO_DATABASE_URL = "libsql://example.turso.io";
    });

    it("throws on a schema error — that is a bug, not an outage", () => {
      const schemaError = new Error("SQLITE_ERROR: no such column: blog_posts.nope");
      expect(() => staticFallbackOrThrow(schemaError, FALLBACK)).toThrow(schemaError);
    });

    it("throws on an auth rejection", () => {
      const authError = Object.assign(new Error("UNAUTHORIZED"), { code: "UNAUTHORIZED" });
      expect(() => staticFallbackOrThrow(authError, FALLBACK)).toThrow(authError);
    });

    it("falls back on a connect timeout nested in a fetch failure", () => {
      // The exact shape Turso produced in dev: TypeError -> ConnectTimeoutError.
      const cause = Object.assign(new Error("Connect Timeout Error"), {
        code: "UND_ERR_CONNECT_TIMEOUT",
      });
      const outer = Object.assign(new TypeError("fetch failed"), { cause });

      expect(staticFallbackOrThrow(outer, FALLBACK)).toBe(FALLBACK);
      expect(warn).toHaveBeenCalled();
    });

    it("falls back on an upstream 5xx", () => {
      const error = new Error("SERVER_ERROR: Server returned HTTP status 502");
      expect(staticFallbackOrThrow(error, FALLBACK)).toBe(FALLBACK);
    });

    it("falls back on a refused connection", () => {
      const error = Object.assign(new Error("connect ECONNREFUSED"), { code: "ECONNREFUSED" });
      expect(staticFallbackOrThrow(error, FALLBACK)).toBe(FALLBACK);
    });

    it("finds an outage nested several causes deep", () => {
      const root = Object.assign(new Error("socket"), { code: "ETIMEDOUT" });
      const mid = Object.assign(new Error("wrapped"), { cause: root });
      const outer = Object.assign(new Error("Failed query: select ..."), { cause: mid });

      expect(staticFallbackOrThrow(outer, FALLBACK)).toBe(FALLBACK);
    });

    it("does not loop forever on a self-referential cause chain", () => {
      const error: { message: string; cause?: unknown } = { message: "boom" };
      error.cause = error;
      expect(() => staticFallbackOrThrow(error, FALLBACK)).toThrow();
    });

    it("throws a non-error value rather than swallowing it", () => {
      expect(() => staticFallbackOrThrow("just a string", FALLBACK)).toThrow();
    });
  });
});
