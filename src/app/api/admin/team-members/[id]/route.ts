import { NextRequest, NextResponse } from "next/server";
import { getTeamMemberById } from "@/db/queries/team-members";
import { db } from "@/db/client";
import { teamMembers } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { apiErrorResponse, boolean, integer, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";
import { revalidateTeamContent } from "@/lib/content-revalidation";

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
  try {
    const { id } = await params;
    const existing = await getTeamMemberById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await readJsonObject(req);
    await db.update(teamMembers).set({
      name: requiredText(body, "name", 160),
      role: requiredText(body, "role", 160),
      bio: optionalText(body, "bio") || "",
      photoMediaId: optionalText(body, "photoMediaId", 100),
      order: integer(body, "order"),
      isActive: boolean(body, "isActive", existing.isActive ?? true),
    }).where(eq(teamMembers.id, id)).run();
    revalidateTeamContent();
    return NextResponse.json(await getTeamMemberById(id));
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
  const existing = await getTeamMemberById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(teamMembers).where(eq(teamMembers.id, id)).run();
  revalidateTeamContent();
  return NextResponse.json({ success: true });
}
