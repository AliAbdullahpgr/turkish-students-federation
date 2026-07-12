import { NextRequest, NextResponse } from "next/server";
import { getBlogPostById } from "@/db/queries/blog-posts";
import { db } from "@/db/client";
import { blogPosts } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import slugify from "slugify";
import { apiErrorResponse, boolean, optionalText, readJsonObject, requiredText } from "@/lib/api-validation";
import { revalidateBlogContent } from "@/lib/content-revalidation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const { id } = await params;
    const existing = await getBlogPostById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await readJsonObject(req, 250_000);
    const title = requiredText(body, "title", 220);
    const requestedSlug = optionalText(body, "slug", 220);
    const slug = slugify(requestedSlug || title, { lower: true, strict: true });
    if (!slug) return NextResponse.json({ error: "slug could not be generated" }, { status: 400 });

    await db.update(blogPosts).set({
      title,
      excerpt: optionalText(body, "excerpt", 1_000) || "",
      body: optionalText(body, "body", 150_000) || "",
      slug,
      thumbnailMediaId: optionalText(body, "thumbnailMediaId", 100),
      category: optionalText(body, "category", 100) || "Blog",
      author: optionalText(body, "author", 160),
      publishedAt: optionalText(body, "publishedAt", 40) || existing.publishedAt || new Date().toISOString(),
      isFeatured: boolean(body, "isFeatured", existing.isFeatured ?? false),
      updatedAt: new Date().toISOString(),
    }).where(eq(blogPosts.id, id)).run();

    revalidateBlogContent(existing.slug);
    revalidateBlogContent(slug);
    const post = await getBlogPostById(id);
    return NextResponse.json(post);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  const { id } = await params;
  const existing = await getBlogPostById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.delete(blogPosts).where(eq(blogPosts.id, id)).run();
  revalidateBlogContent(existing.slug);
  return NextResponse.json({ success: true });
}
