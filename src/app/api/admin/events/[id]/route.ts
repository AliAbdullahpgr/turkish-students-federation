import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/db/queries/events";
import { db } from "@/db/client";
import { events } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { apiErrorResponse, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";
import { revalidateEventContent } from "@/lib/content-revalidation";

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
  try {
    const { id } = await params;
    const existing = await getEventById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await readJsonObject(req);
    await db.update(events).set({
      title: requiredText(body, "title", 180),
      posterMediaId: optionalText(body, "posterMediaId", 100),
      category: optionalText(body, "category", 100),
      status: body.status === "recent" ? "recent" : "upcoming",
      date: optionalText(body, "date", 40),
      location: optionalText(body, "location", 180),
    }).where(eq(events.id, id)).run();
    revalidateEventContent();
    return NextResponse.json(await getEventById(id));
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
  const existing = await getEventById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(events).where(eq(events.id, id)).run();
  revalidateEventContent();
  return NextResponse.json({ success: true });
}
