import { db } from "@/db/client";
import { guideSections } from "@/db/schema";
import { asc, eq, and, isNull } from "drizzle-orm";

export interface GuideSectionTree {
  id: string;
  title: string;
  content?: string;
  level: number;
  sortOrder: number | null;
  children?: GuideSectionTree[];
}

function buildTree(
  sections: typeof guideSections.$inferSelect[],
  parentId: string | null = null
): GuideSectionTree[] {
  return sections
    .filter((s) => s.parentId === parentId)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((s) => ({
      id: s.id,
      title: s.title,
      content: s.content || undefined,
      level: s.level,
      sortOrder: s.sortOrder,
      children: buildTree(sections, s.id),
    }));
}

export async function getGuideSectionTree(): Promise<GuideSectionTree[]> {
  const sections = await db
    .select()
    .from(guideSections)
    .where(eq(guideSections.isPublished, true))
    .orderBy(asc(guideSections.sortOrder))
    .all();

  return buildTree(sections);
}

export async function getAllGuideSections() {
  return db
    .select()
    .from(guideSections)
    .orderBy(asc(guideSections.sortOrder))
    .all();
}

export async function getGuideSectionById(id: string) {
  return db
    .select()
    .from(guideSections)
    .where(eq(guideSections.id, id))
    .get();
}

export async function getTopLevelGuideSections() {
  return db
    .select()
    .from(guideSections)
    .where(
      and(
        isNull(guideSections.parentId),
        eq(guideSections.isPublished, true)
      )
    )
    .orderBy(asc(guideSections.sortOrder))
    .all();
}
