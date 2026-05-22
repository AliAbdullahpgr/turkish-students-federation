import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { guideSections } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

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
  const { id } = await params;
  const body = await req.json();

  await db.update(guideSections).set({
    parentId: body.parentId ?? null,
    title: body.title,
    content: body.content || "",
    level: body.level,
    sortOrder: body.sortOrder,
    isPublished: body.isPublished,
    updatedAt: new Date().toISOString(),
  }).where(eq(guideSections.id, id)).run();

  const section = await db.select().from(guideSections).where(eq(guideSections.id, id)).get();
  return NextResponse.json(section);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  // Also delete children
  await db.delete(guideSections).where(eq(guideSections.parentId, id)).run();
  await db.delete(guideSections).where(eq(guideSections.id, id)).run();
  return NextResponse.json({ success: true });
}
