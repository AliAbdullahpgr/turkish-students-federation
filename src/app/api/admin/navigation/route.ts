import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { navigationItems } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { apiErrorResponse, boolean, integer, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";
import { isKnownPublicHref } from "@/lib/public-routes";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  const all = await db.select().from(navigationItems).orderBy(asc(navigationItems.sortOrder)).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    const body = await readJsonObject(req);
    const id = nanoid();
    const href = requiredText(body, "href", 500);
    if (!isKnownPublicHref(href)) {
      return NextResponse.json({ error: "href must point to an existing public site route" }, { status: 400 });
    }
    await db.insert(navigationItems).values({
      id,
      parentId: optionalText(body, "parentId", 100),
      label: requiredText(body, "label", 100),
      href,
      sortOrder: integer(body, "sortOrder"),
      isVisible: boolean(body, "isVisible", true),
    });
    const item = await db.select().from(navigationItems).where(eq(navigationItems.id, id)).get();
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
