import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/client";
import { guideSections } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const all = await db.select().from(guideSections).orderBy(asc(guideSections.sortOrder)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const id = body.id || nanoid();

  await db.insert(guideSections).values({
    id,
    parentId: body.parentId || null,
    title: body.title,
    content: body.content || "",
    level: body.level || 2,
    sortOrder: body.sortOrder ?? 0,
    isPublished: body.isPublished ?? true,
  });

  const section = await db.select().from(guideSections).where(eq(guideSections.id, id)).get();
  return NextResponse.json(section, { status: 201 });
}
