import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { activities } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { apiErrorResponse, integer, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const all = await db.select().from(activities).orderBy(asc(activities.sortOrder)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const body = await readJsonObject(req);
    const id = nanoid();
    await db.insert(activities).values({
      id,
      title: requiredText(body, "title", 160),
      description: optionalText(body, "description") || "",
      icon: requiredText(body, "icon", 80),
      sortOrder: integer(body, "sortOrder"),
    });
    const activity = await db.select().from(activities).where(eq(activities.id, id)).get();
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
