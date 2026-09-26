import { asc, eq } from "drizzle-orm";
import { navItems as fallbackNavItems } from "@/data/navigation";
import { db } from "@/db/client";
import { navigationItems } from "@/db/schema";
import { staticFallbackOrThrow } from "@/db/queries/static-fallback";
import { isKnownPublicHref, normalizePublicHref } from "@/lib/public-routes";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export async function getNavigationTree(): Promise<NavItem[]> {
  let all;
  try {
    all = await db
      .select()
      .from(navigationItems)
      .where(eq(navigationItems.isVisible, true))
      .orderBy(asc(navigationItems.sortOrder))
      .all();
  } catch (error) {
    return staticFallbackOrThrow(
      error,
      fallbackNavItems.map((item) => ({
        label: item.label,
        href: normalizePublicHref(item.href),
        children: item.children?.map((child) => ({
          label: child.label,
          href: normalizePublicHref(child.href),
        })),
      })),
    );
  }

  // A row pointing at a page the site no longer has (a removed section, a
  // typo) is left out rather than rewritten to "/": a menu entry that silently
  // opens the homepage is worse than no entry. Its children go with it.
  const live = all.filter((item) => isKnownPublicHref(item.href));

  return live
    .filter((item) => item.parentId === null)
    .map((item) => {
      const children = live.filter((child) => child.parentId === item.id);
      return {
        label: item.label,
        href: item.href,
        children: children.length
          ? children.map((child) => ({ label: child.label, href: child.href }))
          : undefined,
      };
    });
}

export async function getAllNavigationItems() {
  return db.select().from(navigationItems).orderBy(asc(navigationItems.sortOrder)).all();
}

export async function getNavigationItemById(id: string) {
  return db.select().from(navigationItems).where(eq(navigationItems.id, id)).get();
}
