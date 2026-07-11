import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { media } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { apiErrorResponse, integer, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const all = await db.select().from(media).orderBy(desc(media.createdAt)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const body = await readJsonObject(req);
    const id = nanoid();
    const url = requiredText(body, "url", 2_000);
    const secureUrl = requiredText(body, "secureUrl", 2_000);
    if (!url.startsWith("https://") || !secureUrl.startsWith("https://")) {
      return NextResponse.json({ error: "Media URLs must use HTTPS" }, { status: 400 });
    }
    await db.insert(media).values({
      id,
      cloudinaryPublicId: requiredText(body, "cloudinaryPublicId", 500),
      url,
      secureUrl,
      width: body.width == null ? null : integer(body, "width", 0, 1, 20_000),
      height: body.height == null ? null : integer(body, "height", 0, 1, 20_000),
      format: optionalText(body, "format", 30),
      resourceType: optionalText(body, "resourceType", 30),
      altText: optionalText(body, "altText", 500),
    });
    const record = await db.select().from(media).where(eq(media.id, id)).get();
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
