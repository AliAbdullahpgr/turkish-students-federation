import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/client";
import { navigationItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const item = await db.select().from(navigationItems).where(eq(navigationItems.id, id)).get();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  await db.update(navigationItems).set({
    parentId: body.parentId ?? null,
    label: body.label,
    href: body.href,
    sortOrder: body.sortOrder,
    isVisible: body.isVisible,
  }).where(eq(navigationItems.id, id)).run();

  const item = await db.select().from(navigationItems).where(eq(navigationItems.id, id)).get();
  return NextResponse.json(item);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(navigationItems).where(eq(navigationItems.parentId, id)).run();
  await db.delete(navigationItems).where(eq(navigationItems.id, id)).run();
  return NextResponse.json({ success: true });
}
