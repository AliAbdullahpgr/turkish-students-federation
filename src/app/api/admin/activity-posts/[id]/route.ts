import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { activityPosts } from "@/db/schema";
import { getActivityPostById } from "@/db/queries/activity-posts";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import slugify from "slugify";
import {
  apiErrorResponse,
  boolean,
  optionalText,
  readJsonObject,
  requiredText,
} from "@/lib/api-validation";
import { revalidateActivityPostContent } from "@/lib/content-revalidation";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  const { id } = await params;
  const post = await getActivityPostById(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const { id } = await params;
    const existing = await getActivityPostById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await readJsonObject(req, 250_000);
    const title = requiredText(body, "title", 220);
    const requestedSlug = optionalText(body, "slug", 220);
    const slug = slugify(requestedSlug || title, { lower: true, strict: true });
    if (!slug) return NextResponse.json({ error: "slug could not be generated" }, { status: 400 });

    await db
      .update(activityPosts)
      .set({
        title,
        excerpt: optionalText(body, "excerpt", 1_000) || "",
        body: optionalText(body, "body", 150_000) || "",
        slug,
        thumbnailMediaId: optionalText(body, "thumbnailMediaId", 100),
        category: optionalText(body, "category", 100) || "Faaliyet",
        location: optionalText(body, "location", 200),
        happenedAt:
          optionalText(body, "happenedAt", 40) || existing.happenedAt || new Date().toISOString(),
        isPublished: boolean(body, "isPublished", existing.isPublished ?? true),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(activityPosts.id, id))
      .run();

    revalidateActivityPostContent(existing.slug);
    revalidateActivityPostContent(slug);
    return NextResponse.json(await getActivityPostById(id));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  const { id } = await params;
  const existing = await getActivityPostById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.delete(activityPosts).where(eq(activityPosts.id, id)).run();
  revalidateActivityPostContent(existing.slug);
  return NextResponse.json({ success: true });
}
