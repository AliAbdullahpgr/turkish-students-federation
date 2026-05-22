import { NextRequest, NextResponse } from "next/server";
import { getBlogPostById } from "@/db/queries/blog-posts";
import { db } from "@/db/client";
import { blogPosts } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

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

  const { id } = await params;
  const body = await req.json();

  await db
    .update(blogPosts)
    .set({
      title: body.title,
      excerpt: body.excerpt,
      body: body.body,
      slug: body.slug,
      thumbnailMediaId: body.thumbnailMediaId ?? null,
      category: body.category,
      author: body.author,
      publishedAt: body.publishedAt,
      isFeatured: body.isFeatured ?? false,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(blogPosts.id, id))
    .run();

  const post = await getBlogPostById(id);
  return NextResponse.json(post);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;

  const { id } = await params;
  await db.delete(blogPosts).where(eq(blogPosts.id, id)).run();
  return NextResponse.json({ success: true });
}
