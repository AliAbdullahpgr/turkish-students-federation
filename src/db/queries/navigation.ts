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

  return topLevel.map((item) => {
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
