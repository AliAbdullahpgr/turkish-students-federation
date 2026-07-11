import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { media } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await params;
  const existing = await db.select({ id: media.id }).from(media).where(eq(media.id, id)).get();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(media).where(eq(media.id, id)).run();
  return NextResponse.json({ success: true });
}
