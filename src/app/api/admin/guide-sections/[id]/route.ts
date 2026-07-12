import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { guideSections } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { apiErrorResponse, boolean, integer, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";
import { revalidateGuideContent } from "@/lib/content-revalidation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  const section = await db.select().from(guideSections).where(eq(guideSections.id, id)).get();
  if (!section) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(section);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const { id } = await params;
    const existing = await db.select().from(guideSections).where(eq(guideSections.id, id)).get();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await readJsonObject(req, 250_000);
    await db.update(guideSections).set({
      parentId: optionalText(body, "parentId", 100),
      title: requiredText(body, "title", 220),
      content: optionalText(body, "content", 150_000) || "",
      level: integer(body, "level", existing.level, 1, 4),
      sortOrder: integer(body, "sortOrder", existing.sortOrder ?? 0),
      isPublished: boolean(body, "isPublished", existing.isPublished ?? true),
      updatedAt: new Date().toISOString(),
    }).where(eq(guideSections.id, id)).run();
    revalidateGuideContent();
    return NextResponse.json(await db.select().from(guideSections).where(eq(guideSections.id, id)).get());
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
  const existing = await db.select({ id: guideSections.id }).from(guideSections).where(eq(guideSections.id, id)).get();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Also delete children
  await db.delete(guideSections).where(eq(guideSections.parentId, id)).run();
  await db.delete(guideSections).where(eq(guideSections.id, id)).run();
  revalidateGuideContent();
  return NextResponse.json({ success: true });
}
