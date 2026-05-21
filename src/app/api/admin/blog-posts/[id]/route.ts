import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/client";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).get();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  const post = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).get();
  return NextResponse.json(post);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(blogPosts).where(eq(blogPosts.id, id)).run();
  return NextResponse.json({ success: true });
}
