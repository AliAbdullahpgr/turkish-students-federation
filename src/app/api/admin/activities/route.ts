import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { activities } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const all = await db.select().from(activities).orderBy(asc(activities.sortOrder)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const body = await req.json();
  const id = nanoid();

  await db.insert(activities).values({
    id,
    title: body.title,
    description: body.description || "",
    icon: body.icon,
    sortOrder: body.sortOrder ?? 0,
  });

  const activity = await db.select().from(activities).where(eq(activities.id, id)).get();
  return NextResponse.json(activity, { status: 201 });
}
