import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { activityPosts } from "@/db/schema";
import { getAllActivityPosts } from "@/db/queries/activity-posts";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import slugify from "slugify";
import {
  apiErrorResponse,
  boolean,
  optionalText,
  readJsonObject,
  requiredText,
} from "@/lib/api-validation";
import { revalidateActivityPostContent } from "@/lib/content-revalidation";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  return NextResponse.json(await getAllActivityPosts());
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const body = await readJsonObject(req, 250_000);
    const id = nanoid();
    const title = requiredText(body, "title", 220);
    const requestedSlug = optionalText(body, "slug", 220);
    const slug =
      slugify(requestedSlug || title, { lower: true, strict: true }) || `activity-${nanoid(6)}`;

    await db.insert(activityPosts).values({
      id,
      title,
      excerpt: optionalText(body, "excerpt", 1_000) || "",
      body: optionalText(body, "body", 150_000) || "",
      slug,
      thumbnailMediaId: optionalText(body, "thumbnailMediaId", 100),
      category: optionalText(body, "category", 100) || "Faaliyet",
      location: optionalText(body, "location", 200),
      happenedAt: optionalText(body, "happenedAt", 40) || new Date().toISOString(),
      isPublished: boolean(body, "isPublished", true),
      updatedAt: new Date().toISOString(),
    });

    revalidateActivityPostContent(slug);
    const created = await db.select().from(activityPosts).where(eq(activityPosts.id, id)).get();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
