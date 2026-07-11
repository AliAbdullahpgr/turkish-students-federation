import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { blogPosts } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { apiErrorResponse, boolean, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  const posts = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
    .all();

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const body = await readJsonObject(req, 250_000);
    const id = nanoid();
    const title = requiredText(body, "title", 220);
    const requestedSlug = optionalText(body, "slug", 220);
    const slug = slugify(requestedSlug || title, { lower: true, strict: true }) || `post-${nanoid(6)}`;
    await db.insert(blogPosts).values({
      id,
      title,
      excerpt: optionalText(body, "excerpt", 1_000) || "",
      body: optionalText(body, "body", 150_000) || "",
      slug,
      thumbnailMediaId: optionalText(body, "thumbnailMediaId", 100),
      category: optionalText(body, "category", 100) || "Blog",
      author: optionalText(body, "author", 160),
      publishedAt: optionalText(body, "publishedAt", 40) || new Date().toISOString(),
      isFeatured: boolean(body, "isFeatured", false),
      updatedAt: new Date().toISOString(),
    });
    const post = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).get();
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
