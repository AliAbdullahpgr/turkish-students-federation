import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { media } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const all = await db.select().from(media).orderBy(desc(media.createdAt)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const body = await req.json();
  const id = nanoid();

  await db.insert(media).values({
    id,
    cloudinaryPublicId: body.cloudinaryPublicId,
    url: body.url,
    secureUrl: body.secureUrl,
    width: body.width || null,
    height: body.height || null,
    format: body.format || null,
    resourceType: body.resourceType || null,
    altText: body.altText || null,
  });

  const record = await db.select().from(media).where(eq(media.id, id)).get();
  return NextResponse.json(record, { status: 201 });
}
