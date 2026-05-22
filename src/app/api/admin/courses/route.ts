import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { courses } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const all = await db.select().from(courses).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const body = await req.json();
  const id = nanoid();

  await db.insert(courses).values({
    id,
    title: body.title,
    instructor: body.instructor || null,
    description: body.description || "",
    thumbnailMediaId: body.thumbnailMediaId || null,
    href: body.href || "#",
  });

  const course = await db.select().from(courses).where(eq(courses.id, id)).get();
  return NextResponse.json(course, { status: 201 });
}
