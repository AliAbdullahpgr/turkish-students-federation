import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { navigationItems } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const all = await db.select().from(navigationItems).orderBy(asc(navigationItems.sortOrder)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const body = await req.json();
  const id = nanoid();

  await db.insert(navigationItems).values({
    id,
    parentId: body.parentId || null,
    label: body.label,
    href: body.href,
    sortOrder: body.sortOrder ?? 0,
    isVisible: body.isVisible ?? true,
  });

  const item = await db.select().from(navigationItems).where(eq(navigationItems.id, id)).get();
  return NextResponse.json(item, { status: 201 });
}
