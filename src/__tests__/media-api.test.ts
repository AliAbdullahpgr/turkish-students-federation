import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";
import { NextRequest } from "next/server";

/*
  Real-write tests for `POST /api/admin/media`.

  These drive the actual route handler against a real libSQL database and
  assert on rows that were really written. The database is a throwaway file
  created per run: `TURSO_DATABASE_URL` is repointed *before* `@/db/client` is
  first imported, because that module resolves the URL lazily on first access
  and then memoises the connection. The repo's `.env` points at the production
  database, so this override is what keeps the suite off it.

  `ADMIN_AUTH_BYPASS=1` is the existing non-production escape hatch in
  `src/lib/auth-guard.ts`; it lets the handler's admin gate pass without a
  better-auth session (and without `next/headers`, which has no request scope
  under vitest).
*/

const tempDir = mkdtempSync(path.join(tmpdir(), "media-api-test-"));
const dbFile = path.join(tempDir, "test.db");

process.env.TURSO_DATABASE_URL = `file:${dbFile.replace(/\\/g, "/")}`;
delete process.env.TURSO_AUTH_TOKEN;
process.env.ADMIN_AUTH_BYPASS = "1";

// The fictional organisation these uploads belong to.
const ORG = {
  name: "Karaca Ogrenci Vakfi",
  slug: "karaca-ogrenci-vakfi",
  cloudName: "karaca-test",
};

let client: Client;
let POST: (req: NextRequest) => Promise<Response>;
let GET: () => Promise<Response>;

function postMedia(body: unknown) {
  return POST(
    new NextRequest("http://localhost/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

/** The exact shape Cloudinary's upload widget hands back: `url` is HTTP-only. */
function cloudinaryResult(publicId: string) {
  return {
    cloudinaryPublicId: `${ORG.slug}/${publicId}`,
    url: `http://res.cloudinary.com/${ORG.cloudName}/image/upload/v1/${ORG.slug}/${publicId}.jpg`,
    secureUrl: `https://res.cloudinary.com/${ORG.cloudName}/image/upload/v1/${ORG.slug}/${publicId}.jpg`,
    width: 1600,
    height: 900,
    format: "jpg",
    resourceType: "image",
  };
}

beforeAll(async () => {
  client = createClient({ url: process.env.TURSO_DATABASE_URL! });

  await client.execute(
    "CREATE TABLE media (" +
      "id TEXT PRIMARY KEY," +
      "cloudinary_public_id TEXT NOT NULL," +
      "url TEXT NOT NULL," +
      "secure_url TEXT NOT NULL," +
      "width INTEGER," +
      "height INTEGER," +
      "format TEXT," +
      "resource_type TEXT," +
      "alt_text TEXT," +
      "created_at TEXT DEFAULT (datetime('now'))" +
      ")",
  );
  await client.execute(
    "CREATE TABLE site_settings (" +
      "key TEXT PRIMARY KEY," +
      "value TEXT NOT NULL," +
      "updated_at TEXT DEFAULT (datetime('now'))" +
      ")",
  );

  // Seed the fake organisation so the fixture looks like a real tenant.
  await client.batch([
    { sql: "INSERT INTO site_settings (key, value) VALUES (?, ?)", args: ["site_name", ORG.name] },
    { sql: "INSERT INTO site_settings (key, value) VALUES (?, ?)", args: ["cloudinary_cloud_name", ORG.cloudName] },
  ]);

  const route = await import("@/app/api/admin/media/route");
  POST = route.POST as typeof POST;
  GET = route.GET as typeof GET;
});

afterAll(async () => {
  client?.close();

  // The route handler opened its own connection through `@/db/client`; Windows
  // refuses to unlink the file while any handle is still open, so close that
  // one too before removing the directory.
  const { db } = await import("@/db/client");
  (db as unknown as { $client: Client }).$client.close();

  try {
    rmSync(tempDir, { recursive: true, force: true });
  } catch {
    // A leftover temp directory is not worth failing a green run over; the OS
    // reclaims it.
  }
});

describe("POST /api/admin/media - real writes", () => {
  it("accepts a real Cloudinary payload and upgrades the HTTP url to HTTPS", async () => {
    const payload = cloudinaryResult("hero-banner");
    const res = await postMedia(payload);

    expect(res.status).toBe(201);
    const created = await res.json();
    expect(created.id).toBeTruthy();

    // Assert against the row actually on disk, not the response body.
    const row = await client.execute({
      sql: "SELECT * FROM media WHERE id = ?",
      args: [created.id],
    });
    expect(row.rows).toHaveLength(1);
    const stored = row.rows[0] as unknown as Record<string, unknown>;
    expect(stored.url).toBe(payload.secureUrl);
    expect(stored.secure_url).toBe(payload.secureUrl);
    expect(stored.cloudinary_public_id).toBe(payload.cloudinaryPublicId);
    expect(stored.width).toBe(1600);
    expect(stored.height).toBe(900);
    expect(stored.format).toBe("jpg");
    expect(stored.resource_type).toBe("image");
  });

  it("accepts a payload that is already HTTPS on both fields", async () => {
    const base = cloudinaryResult("logo");
    const payload = { ...base, url: base.secureUrl };
    const res = await postMedia(payload);
    expect(res.status).toBe(201);
    const created = await res.json();
    const row = await client.execute({ sql: "SELECT url FROM media WHERE id = ?", args: [created.id] });
    expect((row.rows[0] as unknown as { url: string }).url).toBe(payload.secureUrl);
  });

  it("stores optional altText and tolerates missing dimensions", async () => {
    const payload = {
      ...cloudinaryResult("brochure"),
      width: null,
      height: null,
      altText: `${ORG.name} tanitim brosuru`,
    };
    const res = await postMedia(payload);
    expect(res.status).toBe(201);
    const created = await res.json();
    const row = await client.execute({
      sql: "SELECT alt_text, width, height FROM media WHERE id = ?",
      args: [created.id],
    });
    const stored = row.rows[0] as unknown as Record<string, unknown>;
    expect(stored.alt_text).toBe(`${ORG.name} tanitim brosuru`);
    expect(stored.width).toBeNull();
    expect(stored.height).toBeNull();
  });

  it("rejects a non-HTTPS secureUrl and writes nothing", async () => {
    const before = await client.execute("SELECT COUNT(*) AS n FROM media");
    const res = await postMedia({
      ...cloudinaryResult("insecure"),
      secureUrl: `http://res.cloudinary.com/${ORG.cloudName}/image/upload/v1/insecure.jpg`,
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/HTTPS/);
    const after = await client.execute("SELECT COUNT(*) AS n FROM media");
    expect(after.rows[0].n).toBe(before.rows[0].n);
  });

  it("rejects a non-HTTP scheme rather than upgrading it", async () => {
    const res = await postMedia({ ...cloudinaryResult("evil"), url: "ftp://example.com/x.jpg" });
    expect(res.status).toBe(400);
  });

  it("rejects a missing required field", async () => {
    const payload: Record<string, unknown> = cloudinaryResult("no-url");
    delete payload.url;
    const res = await postMedia(payload);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/url is required/);
  });

  it("rejects an out-of-range width", async () => {
    const res = await postMedia({ ...cloudinaryResult("huge"), width: 99_999 });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/width must be an integer/);
  });

  it("rejects a malformed JSON body", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ not json",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("GET returns every row that was really written", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const all = await res.json();
    const count = await client.execute("SELECT COUNT(*) AS n FROM media");
    expect(all).toHaveLength(Number(count.rows[0].n));
    expect(all.every((m: { secureUrl: string }) => m.secureUrl.startsWith("https://"))).toBe(true);
    expect(all.every((m: { url: string }) => m.url.startsWith("https://"))).toBe(true);
  });
});
