import { NextRequest, NextResponse } from "next/server";
import { getTeamMemberById } from "@/db/queries/team-members";
import { db } from "@/db/client";
import { teamMembers } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  const member = await getTeamMemberById(id);
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  const body = await req.json();

  await db.update(teamMembers).set({
    name: body.name,
    role: body.role,
    bio: body.bio,
    photoMediaId: body.photoMediaId ?? null,
    order: body.order,
    isActive: body.isActive,
  }).where(eq(teamMembers.id, id)).run();

  const member = await getTeamMemberById(id);
  return NextResponse.json(member);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  await db.delete(teamMembers).where(eq(teamMembers.id, id)).run();
  return NextResponse.json({ success: true });
}
