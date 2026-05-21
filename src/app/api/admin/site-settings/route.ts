import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.select().from(siteSettings).all();
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  for (const [key, value] of Object.entries(body)) {
    if (typeof value !== "string") continue;
    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .get();

    if (existing) {
      await db
        .update(siteSettings)
        .set({ value, updatedAt: new Date().toISOString() })
        .where(eq(siteSettings.key, key))
        .run();
    } else {
      await db.insert(siteSettings).values({ key, value });
    }
  }

  return NextResponse.json({ success: true });
}
