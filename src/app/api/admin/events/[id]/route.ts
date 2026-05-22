import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/db/queries/events";
import { db } from "@/db/client";
import { events } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  const body = await req.json();

  await db.update(events).set({
    title: body.title,
    posterMediaId: body.posterMediaId ?? null,
    category: body.category,
    status: body.status,
    date: body.date,
    location: body.location,
  }).where(eq(events.id, id)).run();

  const event = await getEventById(id);
  return NextResponse.json(event);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  await db.delete(events).where(eq(events.id, id)).run();
  return NextResponse.json({ success: true });
}
