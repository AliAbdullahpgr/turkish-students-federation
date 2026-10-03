import { asc, eq, and, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { departments, media } from "@/db/schema";
import { departments as fallbackDepartments } from "@/data/departments";
import { staticFallbackOrThrow } from "@/db/queries/static-fallback";

export interface DepartmentMember {
  name: string;
  role: string;
  photoMediaId: string | null;
}

export interface DepartmentGalleryItem {
  mediaId: string;
  caption: string;
}

type DepartmentRow = typeof departments.$inferSelect;

export interface Department extends Omit<DepartmentRow, "members" | "gallery"> {
  hero: string | null;
  members: (DepartmentMember & { photo: string | null })[];
  gallery: (DepartmentGalleryItem & { url: string | null })[];
}

function parseList<T>(raw: string | null | undefined): T[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    return Array.isArray(value) ? (value as T[]) : [];
  } catch {
    return [];
  }
}

async function mediaUrls(ids: string[]) {
  const urls = new Map<string, string>();
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return urls;
  const rows = await db
    .select({ id: media.id, url: media.secureUrl })
    .from(media)
    .where(inArray(media.id, unique))
    .all();
  for (const row of rows) urls.set(row.id, row.url);
  return urls;
}

async function hydrate(rows: DepartmentRow[]): Promise<Department[]> {
  const parsed = rows.map((row) => ({
    row,
    members: parseList<DepartmentMember>(row.members),
    gallery: parseList<DepartmentGalleryItem>(row.gallery),
  }));
  const urls = await mediaUrls(
    parsed.flatMap(({ row, members, gallery }) => [
      row.heroMediaId ?? "",
      ...members.map((m) => m.photoMediaId ?? ""),
      ...gallery.map((g) => g.mediaId),
    ]),
  );

  return parsed.map(({ row, members, gallery }) => ({
    ...row,
    hero: row.heroMediaId ? (urls.get(row.heroMediaId) ?? null) : null,
    members: members.map((m) => ({
      name: m.name,
      role: m.role,
      photoMediaId: m.photoMediaId ?? null,
      photo: m.photoMediaId ? (urls.get(m.photoMediaId) ?? null) : null,
    })),
    gallery: gallery.map((g) => ({
      mediaId: g.mediaId,
      caption: g.caption ?? "",
      url: urls.get(g.mediaId) ?? null,
    })),
  }));
}

/**
 * The table arrives with `migrations/002_departments.sql`. Until it has been
 * applied to a database, the public pages keep serving the static list instead
 * of failing; every other query error still throws.
 */
function isMissingTable(error: unknown, depth = 0): boolean {
  if (!error || depth > 6 || typeof error !== "object") return false;
  const candidate = error as { message?: unknown; cause?: unknown };
  if (typeof candidate.message === "string" && /no such table: departments/i.test(candidate.message)) return true;
  return isMissingTable(candidate.cause, depth + 1);
}

function fallbackOrThrow<T>(error: unknown, value: T): T {
  if (isMissingTable(error)) {
    console.warn("[db] departments table missing, serving static fallback");
    return value;
  }
  return staticFallbackOrThrow(error, value);
}

const fallback: Department[] = fallbackDepartments.map((d, sortOrder) => ({
  id: d.slug,
  slug: d.slug,
  name: d.name,
  summary: d.summary,
  body: "",
  icon: d.icon,
  heroMediaId: null,
  hero: null,
  members: [],
  gallery: [],
  isPublished: true,
  sortOrder,
  createdAt: null,
  updatedAt: null,
}));

export async function getAllDepartments() {
  try {
    return await hydrate(await db.select().from(departments).orderBy(asc(departments.sortOrder)).all());
  } catch (error) {
    return fallbackOrThrow(error, fallback);
  }
}

export async function getPublishedDepartments() {
  try {
    return await hydrate(
      await db
        .select()
        .from(departments)
        .where(eq(departments.isPublished, true))
        .orderBy(asc(departments.sortOrder))
        .all(),
    );
  } catch (error) {
    return fallbackOrThrow(error, fallback);
  }
}

export async function getDepartmentBySlug(slug: string) {
  try {
    const row = await db
      .select()
      .from(departments)
      .where(and(eq(departments.slug, slug), eq(departments.isPublished, true)))
      .get();
    return row ? (await hydrate([row]))[0] : undefined;
  } catch (error) {
    return fallbackOrThrow(
      error,
      fallback.find((d) => d.slug === slug),
    );
  }
}

export async function getDepartmentById(id: string) {
  const row = await db.select().from(departments).where(eq(departments.id, id)).get();
  return row ? (await hydrate([row]))[0] : undefined;
}
