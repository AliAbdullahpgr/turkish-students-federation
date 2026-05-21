import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/client";
import { activities } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const all = await db.select().from(activities).orderBy(asc(activities.sortOrder)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const id = nanoid();

  await db.insert(activities).values({
    id,
    title: body.title,
    description: body.description || "",
    icon: body.icon,
    sortOrder: body.sortOrder ?? 0,
  });

  const activity = await db.select().from(activities).where(eq(activities.id, id)).get();
  return NextResponse.json(activity, { status: 201 });
}
