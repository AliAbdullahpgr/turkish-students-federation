"use client";

import PostCard from "@/components/ui/PostCard";
import FadeIn from "@/components/animation/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import type { HomeContent } from "@/db/queries/home-sections";

interface BlogPostItem {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  thumbnail?: string | null;
  isFeatured?: boolean | null;
  category?: string | null;
  publishedAt?: string | null;
  author?: string | null;
}

interface MediaNewsSectionProps {
  posts: BlogPostItem[];
  content: HomeContent["blog"];
}

export default function MediaNewsSection({ posts, content }: MediaNewsSectionProps) {
  const latestPosts = posts.slice(0, 3);

  return (
    <section className="bg-white py-section border-t border-border-custom" aria-labelledby="home-blog-title">
      <div className="mx-auto w-full max-w-[1280px] min-w-0 px-6 lg:px-12">
        <FadeIn>
          <SectionHeader
            titleId="home-blog-title"
            title={content.title}
            lede={content.lede || undefined}
            action={content.cta && content.href ? { href: content.href, label: content.cta } : undefined}
          />
        </FadeIn>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              href={`/news-blogs/${post.slug}/`}
              date={post.publishedAt ?? undefined}
              author={post.author ?? "Pakistan Türk Öğrenci Birliği"}
              category={post.category ?? undefined}
              thumbnail={post.thumbnail ?? undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
