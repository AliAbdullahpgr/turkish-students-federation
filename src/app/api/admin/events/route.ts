import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { events } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  const all = await db.select().from(events).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  const body = await req.json();
  const id = nanoid();

  await db.insert(events).values({
    id,
    title: body.title,
    posterMediaId: body.posterMediaId || null,
    category: body.category || null,
    status: body.status || "upcoming",
    date: body.date || null,
    location: body.location || null,
  });

  const event = await db.select().from(events).where(eq(events.id, id)).get();
  return NextResponse.json(event, { status: 201 });
}
