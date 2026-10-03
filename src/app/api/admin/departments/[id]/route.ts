import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { departments } from "@/db/schema";
import { getDepartmentById } from "@/db/queries/departments";
import { requireAdminRequest } from "@/lib/admin-auth";
import { apiErrorResponse, readJsonObject } from "@/lib/api-validation";
import { parseDepartmentInput } from "@/lib/department-input";
import { revalidateDepartmentContent } from "@/lib/content-revalidation";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Context) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  const department = await getDepartmentById(id);
  if (!department) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(department);
}

export async function PUT(req: NextRequest, { params }: Context) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const { id } = await params;
    const existing = await db.select({ slug: departments.slug }).from(departments).where(eq(departments.id, id)).get();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const input = parseDepartmentInput(await readJsonObject(req, 400_000));
    await db
      .update(departments)
      .set({ ...input, updatedAt: new Date().toISOString() })
      .where(eq(departments.id, id))
      .run();

    revalidateDepartmentContent(existing.slug);
    revalidateDepartmentContent(input.slug);
    return NextResponse.json(await getDepartmentById(id));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  const existing = await db.select({ slug: departments.slug }).from(departments).where(eq(departments.id, id)).get();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(departments).where(eq(departments.id, id)).run();
  revalidateDepartmentContent(existing.slug);
  return NextResponse.json({ success: true });
}
