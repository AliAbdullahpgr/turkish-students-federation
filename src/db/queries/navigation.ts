import { db } from "@/db/client";
import { navigationItems } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export async function getNavigationTree(): Promise<NavItem[]> {
  const all = await db
    .select()
    .from(navigationItems)
    .where(eq(navigationItems.isVisible, true))
    .orderBy(asc(navigationItems.sortOrder))
    .all();

  const topLevel = all.filter((item) => item.parentId === null);

  const tree = topLevel.map((item) => {
    const children = all.filter((child) => child.parentId === item.id);
    return {
      label: item.label,
      href: item.href,
      children:
        children.length > 0
          ? children.map((child) => ({
              label: child.label,
              href: child.href,
            }))
          : undefined,
    };
  });

  const cleaned = tree
    .filter((item) => !/Pakistan (Rehberi|Öğrenci Rehberi)/i.test(item.label))
    .filter((item) => !/Haberler\s*&\s*Blog/i.test(item.label))
    .map((item) =>
      /Yayınlar/i.test(item.label)
        ? { ...item, children: item.children?.filter((child) => /Kitaplar|Bülten/i.test(child.label)) }
        : item
    );

  const combinedIndex = tree.findIndex((item) => /Haberler\s*&\s*Blog/i.test(item.label));
  const insertAt = combinedIndex >= 0 ? Math.min(combinedIndex, cleaned.length) : cleaned.length;
  cleaned.splice(
    insertAt,
    0,
    { label: "Haberler", href: "/news-blogs/?type=news", children: undefined },
    { label: "Blog", href: "/news-blogs/?type=blog", children: undefined }
  );

  return cleaned;
}

export async function getAllNavigationItems() {
  return db
    .select()
    .from(navigationItems)
    .orderBy(asc(navigationItems.sortOrder))
    .all();
}

export async function getNavigationItemById(id: string) {
  return db
    .select()
    .from(navigationItems)
    .where(eq(navigationItems.id, id))
    .get();
}
