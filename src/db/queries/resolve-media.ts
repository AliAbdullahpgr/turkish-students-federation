import { db } from "@/db/client";
import { media } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

const cache = new Map<string, string | null>();

export async function resolveMediaUrls<T extends Record<string, unknown>>(
  rows: T[],
  fkKey: keyof T,
  urlKey?: string,
): Promise<(T & Record<string, unknown>)[]> {
  if (rows.length === 0) return rows as (T & Record<string, unknown>)[];

  const mediaIds = [...new Set(rows.map((r) => r[fkKey] as string).filter(Boolean))];

  const uncached = mediaIds.filter((id) => !cache.has(id));

  if (uncached.length > 0) {
    const records = await db
      .select({ id: media.id, secureUrl: media.secureUrl })
      .from(media)
      .where(inArray(media.id, uncached))
      .all();

    for (const r of records) {
      cache.set(r.id, r.secureUrl);
    }
    for (const id of uncached) {
      if (!cache.has(id)) cache.set(id, null);
    }
  }

  const targetKey = urlKey || (fkKey as string);

  return rows.map((row) => ({
    ...row,
    [targetKey]: cache.get(row[fkKey] as string) ?? null,
  }));
}
