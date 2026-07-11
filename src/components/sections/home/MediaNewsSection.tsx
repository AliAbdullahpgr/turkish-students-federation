"use client";

import BlogCard from "@/components/ui/BlogCard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FadeIn from "@/components/animation/FadeIn";

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
}

export default function MediaNewsSection({ posts }: MediaNewsSectionProps) {
  const latestPosts = posts.slice(0, 6);

  return (
    <section className="overflow-x-clip bg-surface py-section" aria-labelledby="home-blog-title">
      <div className="mx-auto w-full max-w-[1280px] min-w-0 px-6 lg:px-12">
        <FadeIn className="mb-10 grid grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto] sm:gap-10">
          <h2 id="home-blog-title" className="text-section-title font-heading font-bold text-primary">
            Blog
          </h2>
          <p className="hidden w-[420px] max-w-full text-right text-sm leading-6 text-text-secondary sm:block">Pakistan&apos;da öğrenci hayatı için hikâyeler, bilgiler ve pratik öneriler.</p>
        </FadeIn>

        <div className="flex w-full min-w-0 snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-5" role="list">
          {latestPosts.map((post) => (
            <div key={post.id} className="w-[min(82vw,360px)] shrink-0 snap-start" role="listitem">
              <BlogCard
                date={post.publishedAt ?? ""}
                title={post.title}
                excerpt={post.excerpt}
                href={`/news-blogs/${post.slug}/`}
                isTurkish={true}
                thumbnail={post.thumbnail ?? undefined}
                author={post.author ?? "Pakistan Türk Öğrenci Birliği"}
              />
            </div>
          ))}
        </div>

        <FadeIn delay={0.4} className="text-center mt-12">
          <PrimaryButton href="/news-blogs/?type=blog">TÜM BLOGLAR</PrimaryButton>
        </FadeIn>
      </div>
    </section>
  );
}
