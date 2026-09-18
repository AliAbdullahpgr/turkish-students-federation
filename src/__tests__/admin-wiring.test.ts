import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Structural checks that every admin screen actually reaches the public site.
 *
 * These read the source tree rather than the database on purpose: the repo's
 * `.env` points at the live Turso instance, so a suite that inserted rows would
 * be writing to real site content. Everything here is filesystem-only and safe
 * to run anywhere, including CI without secrets.
 */

const ROOT = process.cwd();
const ADMIN_DIR = path.join(ROOT, "src/app/admin/(protected)");
const API_DIR = path.join(ROOT, "src/app/api/admin");
const QUERIES_DIR = path.join(ROOT, "src/db/queries");
const PUBLIC_SRC = [path.join(ROOT, "src/app"), path.join(ROOT, "src/components")];

function dirs(target: string): string[] {
  if (!existsSync(target)) return [];
  return readdirSync(target).filter((entry) => statSync(path.join(target, entry)).isDirectory());
}

function walk(target: string, out: string[] = []): string[] {
  if (!existsSync(target)) return out;
  for (const entry of readdirSync(target)) {
    const full = path.join(target, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

function read(file: string): string {
  return readFileSync(file, "utf8");
}

const adminSections = dirs(ADMIN_DIR);
const apiSections = dirs(API_DIR);

/** Files that render the public site (everything outside /admin and /api). */
const publicFiles = PUBLIC_SRC.flatMap((dir) => walk(dir)).filter((file) => {
  const rel = file.replace(ROOT, "").replace(/\\/g, "/");
  return !rel.includes("/admin") && !rel.includes("/api/");
});
const publicSource = publicFiles.map(read).join("\n");

describe("admin sections", () => {
  it("finds the admin screens", () => {
    expect(adminSections.length).toBeGreaterThan(8);
  });

  it.each(adminSections)("%s can persist its changes", (section) => {
    const hasRestRoute = apiSections.includes(section);

    const sectionFiles = walk(path.join(ADMIN_DIR, section)).map(read).join("\n");
    // Sections without a REST route save through a server action instead.
    const usesServerAction = /action=\{/.test(sectionFiles);
    // A read-only screen (an inbox) is legitimate if it never offers an edit.
    const isReadOnly = !/<form|action=\{|fetch\(/.test(sectionFiles);

    expect(
      hasRestRoute || usesServerAction || isReadOnly,
      `${section} has no API route, no server action and no form — nothing can be saved`,
    ).toBe(true);
  });

  it.each(apiSections)("/api/admin/%s exposes a route handler", (section) => {
    const files = walk(path.join(API_DIR, section));
    expect(files.length, `no route file under api/admin/${section}`).toBeGreaterThan(0);
    const source = files.map(read).join("\n");
    expect(source).toMatch(/export async function (GET|POST|PUT|PATCH|DELETE)/);
  });

  it.each(apiSections)("/api/admin/%s requires authentication", (section) => {
    const source = walk(path.join(API_DIR, section)).map(read).join("\n");
    expect(
      /requireAdmin|admin-auth|getSession|auth\(/.test(source),
      `api/admin/${section} does not check an admin session`,
    ).toBe(true);
  });
});

describe("queries reach the public site", () => {
  const queryModules = existsSync(QUERIES_DIR)
    ? readdirSync(QUERIES_DIR).filter(
        (file) =>
          file.endsWith(".ts") &&
          !file.startsWith("static-fallback") &&
          !file.startsWith("resolve-media") &&
          !file.startsWith("contact-submissions"),
      )
    : [];

  it("finds the query modules", () => {
    expect(queryModules.length).toBeGreaterThan(5);
  });

  /**
   * `guide-sections` is editable in the admin ("Rehber bölümleri"), has a REST
   * API and is seeded, but nothing on the public site reads it: the "Pakistan
   * Rehberi" nav entry permanently redirects to the blog. Editing it therefore
   * changes nothing a visitor can see.
   *
   * Listed here so the suite stays green while the gap stays visible. Remove the
   * entry once a public page renders the guide — or delete the admin screen and
   * the table if the blog has genuinely replaced it.
   */
  const KNOWN_ORPHANED = new Set(["guide-sections.ts"]);

  it.each(queryModules)("%s exports a getter the public site calls", (file) => {
    const source = read(path.join(QUERIES_DIR, file));
    const exported = [...source.matchAll(/export async function (\w+)/g)].map((m) => m[1]);

    expect(exported.length, `${file} exports no async getters`).toBeGreaterThan(0);

    const used = exported.some((name) => publicSource.includes(name));

    if (KNOWN_ORPHANED.has(file)) {
      expect(
        used,
        `${file} is now wired to a public page — remove it from KNOWN_ORPHANED`,
      ).toBe(false);
      return;
    }

    expect(used, `none of ${file}'s exports (${exported.join(", ")}) are used by a public page`).toBe(
      true,
    );
  });

  it("every public query guards against a database outage", () => {
    for (const file of queryModules) {
      const source = read(path.join(QUERIES_DIR, file));
      if (!/await db/.test(source)) continue;
      expect(
        source.includes("staticFallbackOrThrow"),
        `${file} queries the database without an outage fallback`,
      ).toBe(true);
    }
  });
});

describe("public pages are not hardcoded past the CMS", () => {
  it("renders navigation from the database, not a literal list", () => {
    const nav = read(path.join(ROOT, "src/components/layout/NavigationRSC.tsx"));
    expect(nav).toMatch(/getNavigation|navigationItems|getVisibleNavigation/);
  });

  it("renders the footer description and socials from the database", () => {
    const footer = read(path.join(ROOT, "src/components/layout/FooterRSC.tsx"));
    expect(footer).toMatch(/getSiteSetting/);
    expect(footer).toMatch(/SocialAccounts/);
  });

  it("does not reintroduce a remote stock photo as a default image", () => {
    expect(
      /unsplash\.com/.test(publicSource),
      "a remote stock image is back in the public site; heroes must use local files",
    ).toBe(false);
  });

  it("keeps capsule shapes out of the public site", () => {
    expect(/rounded-pill/.test(publicSource)).toBe(false);
  });

  it("keeps card shadows out of the public site", () => {
    const offenders = publicFiles.filter((file) => /shadow-(card|btn|about-card)\b/.test(read(file)));
    expect(offenders.map((f) => f.replace(ROOT, ""))).toEqual([]);
  });
});
