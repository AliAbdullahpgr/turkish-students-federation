import { asc, eq } from "drizzle-orm";
import { navItems as fallbackNavItems } from "@/data/navigation";
import { db } from "@/db/client";
import { navigationItems } from "@/db/schema";
import { staticFallbackOrThrow } from "@/db/queries/static-fallback";
import { isKnownPublicHref, normalizePublicHref } from "@/lib/public-routes";

type NavigationRow = { id: string; parentId: string | null; href: string };

/**
 * Rows pointing at a page the site no longer has (the old "Pakistan Rehberi"
 * and "Yayınlar" entries, or a typo) are dropped, and so is anything nested
 * under them. They are left out rather than rewritten to "/": a menu entry that
 * silently opens the homepage is worse than no entry. The admin reads through
 * this too, so those rows cannot be listed or opened there either.
 */
export function liveNavigationRows<T extends NavigationRow>(rows: T[]): T[] {
  const known = rows.filter((row) => isKnownPublicHref(row.href));
  const ids = new Set(known.map((row) => row.id));
  return known.filter((row) => row.parentId === null || ids.has(row.parentId));
}

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

  const live = liveNavigationRows(all);

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
