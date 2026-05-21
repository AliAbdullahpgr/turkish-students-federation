import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/client";
import { media } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const all = await db.select().from(media).orderBy(desc(media.createdAt)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
