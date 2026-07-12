import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { navigationItems } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { apiErrorResponse, boolean, integer, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";
import { revalidateNavigationContent } from "@/lib/content-revalidation";
import { isKnownPublicHref } from "@/lib/public-routes";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  const item = await db.select().from(navigationItems).where(eq(navigationItems.id, id)).get();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const { id } = await params;
    const existing = await db.select().from(navigationItems).where(eq(navigationItems.id, id)).get();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await readJsonObject(req);
    const href = requiredText(body, "href", 500);
    if (!isKnownPublicHref(href)) {
      return NextResponse.json({ error: "href must point to an existing public site route" }, { status: 400 });
    }
    await db.update(navigationItems).set({
      parentId: optionalText(body, "parentId", 100),
      label: requiredText(body, "label", 100),
      href,
      sortOrder: integer(body, "sortOrder", existing.sortOrder ?? 0),
      isVisible: boolean(body, "isVisible", existing.isVisible ?? true),
    }).where(eq(navigationItems.id, id)).run();
    revalidateNavigationContent();
    return NextResponse.json(await db.select().from(navigationItems).where(eq(navigationItems.id, id)).get());
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  const existing = await db.select({ id: navigationItems.id }).from(navigationItems).where(eq(navigationItems.id, id)).get();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(navigationItems).where(eq(navigationItems.parentId, id)).run();
  await db.delete(navigationItems).where(eq(navigationItems.id, id)).run();
  revalidateNavigationContent();
  return NextResponse.json({ success: true });
}
