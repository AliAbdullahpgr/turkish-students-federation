import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { navigationItems } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { apiErrorResponse, readJsonObject } from "@/lib/api-validation";

export async function PUT(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const body = await readJsonObject(req);
    if (!Array.isArray(body.items) || body.items.length > 200) {
      return NextResponse.json({ error: "items must be an array with at most 200 entries" }, { status: 400 });
    }
    for (const item of body.items) {
      if (!item || typeof item !== "object" || typeof item.id !== "string" || !Number.isInteger(item.sortOrder)) {
        return NextResponse.json({ error: "Each item requires a string id and integer sortOrder" }, { status: 400 });
      }
      await db.update(navigationItems).set({
        parentId: typeof item.parentId === "string" ? item.parentId : null,
        sortOrder: item.sortOrder,
      }).where(eq(navigationItems.id, item.id)).run();
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
