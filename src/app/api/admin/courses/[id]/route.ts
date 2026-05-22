import { NextRequest, NextResponse } from "next/server";
import { getCourseById } from "@/db/queries/courses";
import { db } from "@/db/client";
import { courses } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

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
  const { id } = await params;
  const body = await req.json();

  await db.update(courses).set({
    title: body.title,
    instructor: body.instructor,
    description: body.description,
    thumbnailMediaId: body.thumbnailMediaId ?? null,
    href: body.href,
  }).where(eq(courses.id, id)).run();

  const course = await getCourseById(id);
  return NextResponse.json(course);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  await db.delete(courses).where(eq(courses.id, id)).run();
  return NextResponse.json({ success: true });
}
