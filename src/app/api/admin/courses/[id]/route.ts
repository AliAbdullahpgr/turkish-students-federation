import { NextRequest, NextResponse } from "next/server";
import { getCourseById } from "@/db/queries/courses";
import { db } from "@/db/client";
import { courses } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { apiErrorResponse, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";
import { isKnownPublicHref } from "@/lib/public-routes";
import { revalidateCourseContent } from "@/lib/content-revalidation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(course);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const { id } = await params;
    const existing = await getCourseById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await readJsonObject(req);
    const href = optionalText(body, "href", 500) || "#";
    if (!isKnownPublicHref(href) && !href.startsWith("https://")) {
      return NextResponse.json({ error: "href must be a known site route or HTTPS URL" }, { status: 400 });
    }
    await db.update(courses).set({
      title: requiredText(body, "title", 160),
      instructor: optionalText(body, "instructor", 160),
      description: optionalText(body, "description") || "",
      thumbnailMediaId: optionalText(body, "thumbnailMediaId", 100),
      href,
    }).where(eq(courses.id, id)).run();
    revalidateCourseContent();
    return NextResponse.json(await getCourseById(id));
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
  const existing = await getCourseById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(courses).where(eq(courses.id, id)).run();
  revalidateCourseContent();
  return NextResponse.json({ success: true });
}
