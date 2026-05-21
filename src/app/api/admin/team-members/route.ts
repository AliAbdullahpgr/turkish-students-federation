import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/client";
import { teamMembers } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const members = await db.select().from(teamMembers).orderBy(asc(teamMembers.order)).all();
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const id = nanoid();

  await db.insert(teamMembers).values({
    id,
    name: body.name,
    role: body.role,
    bio: body.bio || "",
    photoMediaId: body.photoMediaId || null,
    order: body.order ?? 0,
    isActive: body.isActive ?? true,
  });

  const member = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).get();
  return NextResponse.json(member, { status: 201 });
}
