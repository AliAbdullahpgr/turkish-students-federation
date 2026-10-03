import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/db/client";
import { departments } from "@/db/schema";
import { getAllDepartments, getDepartmentById } from "@/db/queries/departments";
import { requireAdminRequest } from "@/lib/admin-auth";
import { apiErrorResponse, readJsonObject } from "@/lib/api-validation";
import { parseDepartmentInput } from "@/lib/department-input";
import { revalidateDepartmentContent } from "@/lib/content-revalidation";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  return NextResponse.json(await getAllDepartments());
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const body = await readJsonObject(req, 400_000);
    const input = parseDepartmentInput(body);
    const id = nanoid();
    await db.insert(departments).values({ id, ...input, updatedAt: new Date().toISOString() });
    revalidateDepartmentContent(input.slug);
    return NextResponse.json(await getDepartmentById(id), { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
