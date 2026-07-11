import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { teamMembers } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { apiErrorResponse, boolean, integer, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const members = await db.select().from(teamMembers).orderBy(asc(teamMembers.order)).all();
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const body = await readJsonObject(req);
    const id = nanoid();
    await db.insert(teamMembers).values({
      id,
      name: requiredText(body, "name", 160),
      role: requiredText(body, "role", 160),
      bio: optionalText(body, "bio") || "",
      photoMediaId: optionalText(body, "photoMediaId", 100),
      order: integer(body, "order"),
      isActive: boolean(body, "isActive", true),
    });
    const member = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).get();
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
