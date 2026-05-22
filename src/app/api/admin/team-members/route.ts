import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { teamMembers } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const members = await db.select().from(teamMembers).orderBy(asc(teamMembers.order)).all();
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
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
