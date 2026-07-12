import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { events } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { apiErrorResponse, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";
import { revalidateEventContent } from "@/lib/content-revalidation";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  const all = await db.select().from(events).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const body = await readJsonObject(req);
    const id = nanoid();
    const status = body.status === "recent" ? "recent" : "upcoming";
    await db.insert(events).values({
      id,
      title: requiredText(body, "title", 180),
      posterMediaId: optionalText(body, "posterMediaId", 100),
      category: optionalText(body, "category", 100),
      status,
      date: optionalText(body, "date", 40),
      location: optionalText(body, "location", 180),
    });
    revalidateEventContent();
    const event = await db.select().from(events).where(eq(events.id, id)).get();
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
