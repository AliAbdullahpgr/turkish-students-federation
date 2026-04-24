"use client";

import { blogPosts } from "@/data/blogs";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import BlogCard from "@/components/ui/BlogCard";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function MediaNewsSection() {
  const latestPosts = blogPosts.slice(0, 6);

  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <SectionEyebrow text="MEDIA & NEWS" />
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Read Our Latest <span className="text-accent">Updates</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post) => (
            <BlogCard
              key={post.id}
              date={post.date}
              title={post.titleTurkish || post.title}
              excerpt={post.excerptTurkish || post.excerpt}
              href={`/news-blogs/${post.slug}/`}
              isTurkish={post.isTurkish}
              thumbnail={post.thumbnail}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <PrimaryButton href="/news-blogs/">MORE BLOGS</PrimaryButton>
        </div>
      </div>
    </section>
  );
}
