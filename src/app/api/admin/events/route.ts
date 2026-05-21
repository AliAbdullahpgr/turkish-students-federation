import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/client";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const all = await db.select().from(events).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
