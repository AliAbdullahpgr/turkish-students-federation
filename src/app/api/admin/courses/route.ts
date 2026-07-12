import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { courses } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { apiErrorResponse, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";
import { isKnownPublicHref } from "@/lib/public-routes";
import { revalidateCourseContent } from "@/lib/content-revalidation";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const all = await db.select().from(courses).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const body = await readJsonObject(req);
    const id = nanoid();
    const href = optionalText(body, "href", 500) || "#";
    if (!isKnownPublicHref(href) && !href.startsWith("https://")) {
      return NextResponse.json({ error: "href must be a known site route or HTTPS URL" }, { status: 400 });
    }
    await db.insert(courses).values({
      id,
      title: requiredText(body, "title", 160),
      instructor: optionalText(body, "instructor", 160),
      description: optionalText(body, "description") || "",
      thumbnailMediaId: optionalText(body, "thumbnailMediaId", 100),
      href,
    });
    revalidateCourseContent();
    const course = await db.select().from(courses).where(eq(courses.id, id)).get();
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
