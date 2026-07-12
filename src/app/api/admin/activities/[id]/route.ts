import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { activities } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { apiErrorResponse, integer, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";
import { revalidateActivityContent } from "@/lib/content-revalidation";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  const activity = await db.select().from(activities).where(eq(activities.id, id)).get();
  if (!activity) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(activity);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const { id } = await params;
    const existing = await db.select().from(activities).where(eq(activities.id, id)).get();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await readJsonObject(req);
    await db.update(activities).set({
      title: requiredText(body, "title", 160),
      description: optionalText(body, "description") || "",
      icon: requiredText(body, "icon", 80),
      sortOrder: integer(body, "sortOrder"),
    }).where(eq(activities.id, id)).run();
    revalidateActivityContent();
    const activity = await db.select().from(activities).where(eq(activities.id, id)).get();
    return NextResponse.json(activity);
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
  const existing = await db.select({ id: activities.id }).from(activities).where(eq(activities.id, id)).get();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(activities).where(eq(activities.id, id)).run();
  revalidateActivityContent();
  return NextResponse.json({ success: true });
}
