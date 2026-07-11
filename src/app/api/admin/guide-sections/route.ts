import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { guideSections } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { apiErrorResponse, boolean, integer, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const all = await db.select().from(guideSections).orderBy(asc(guideSections.sortOrder)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const body = await readJsonObject(req, 250_000);
    const id = optionalText(body, "id", 100) || nanoid();
    await db.insert(guideSections).values({
      id,
      parentId: optionalText(body, "parentId", 100),
      title: requiredText(body, "title", 220),
      content: optionalText(body, "content", 150_000) || "",
      level: integer(body, "level", 2, 1, 4),
      sortOrder: integer(body, "sortOrder"),
      isPublished: boolean(body, "isPublished", true),
    });
    const section = await db.select().from(guideSections).where(eq(guideSections.id, id)).get();
    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
