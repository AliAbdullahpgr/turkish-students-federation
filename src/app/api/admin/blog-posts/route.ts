import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { blogPosts } from "@/db/schema";
import { requireAdminRequest } from "@/lib/admin-auth";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import slugify from "slugify";

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

  const body = await req.json();
  const id = nanoid();
  const slug =
    body.slug ||
    slugify(body.title, { lower: true, strict: true }) + "-" + nanoid(6);

  await db.insert(blogPosts).values({
    id,
    title: body.title,
    excerpt: body.excerpt || "",
    body: body.body || "",
    slug,
    thumbnailMediaId: body.thumbnailMediaId || null,
    category: body.category || "Blog",
    author: body.author || null,
    publishedAt: body.publishedAt || new Date().toISOString(),
    isFeatured: body.isFeatured || false,
    updatedAt: new Date().toISOString(),
  });

  const post = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).get();
  return NextResponse.json(post, { status: 201 });
}
