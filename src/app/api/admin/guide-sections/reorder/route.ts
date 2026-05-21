import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/client";
import { guideSections } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // body: { items: { id: string; parentId: string | null; sortOrder: number }[] }
  if (!Array.isArray(body.items)) {
    return NextResponse.json({ error: "items array required" }, { status: 400 });
  }

  for (const item of body.items) {
    await db
      .update(guideSections)
      .set({
        parentId: item.parentId ?? null,
        sortOrder: item.sortOrder,
      })
      .where(eq(guideSections.id, item.id))
      .run();
  }

  return NextResponse.json({ success: true });
}
