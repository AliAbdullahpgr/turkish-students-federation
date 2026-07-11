import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { apiErrorResponse, readJsonObject } from "@/lib/api-validation";

const editableKeys = new Set([
  "site_name", "site_short_name", "join_href", "site_description",
  "home_eyebrow", "home_title_top", "home_title_bottom", "home_summary",
  "home_primary_cta", "home_secondary_cta", "home_about_intro",
]);

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const rows = await db.select().from(siteSettings).all();
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const body = await readJsonObject(req);
    for (const [key, value] of Object.entries(body)) {
      if (!editableKeys.has(key) || typeof value !== "string") continue;
      const safeValue = value.trim().slice(0, key.includes("description") || key.includes("summary") || key.includes("intro") ? 10_000 : 500);
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).get();
      if (existing) {
        await db.update(siteSettings).set({ value: safeValue, updatedAt: new Date().toISOString() }).where(eq(siteSettings.key, key)).run();
      } else {
        await db.insert(siteSettings).values({ key, value: safeValue });
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
