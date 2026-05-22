import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { activities } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

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
  const { id } = await params;
  const body = await req.json();

  await db.update(activities).set({
    title: body.title,
    description: body.description,
    icon: body.icon,
    sortOrder: body.sortOrder,
  }).where(eq(activities.id, id)).run();

  const activity = await db.select().from(activities).where(eq(activities.id, id)).get();
  return NextResponse.json(activity);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  await db.delete(activities).where(eq(activities.id, id)).run();
  return NextResponse.json({ success: true });
}
