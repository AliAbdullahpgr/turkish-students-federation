"use client";

import { blogPosts } from "@/data/blogs";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import BlogCard from "@/components/ui/BlogCard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

export default function MediaNewsSection() {
  const latestPosts = blogPosts.slice(0, 6);

  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-12">
          <SectionEyebrow text="MEDYA & HABERLER" />
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Son <span className="text-accent">Güncellemeler</span>
          </h2>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          staggerDelay={0.1}
        >
          {latestPosts.map((post) => (
            <StaggerItem key={post.id}>
              <BlogCard
                date={post.date}
                title={post.titleTurkish || post.title}
                excerpt={post.excerptTurkish || post.excerpt}
                href={`/news-blogs/${post.slug}/`}
                isTurkish={post.isTurkish}
                thumbnail={post.thumbnail}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.4} className="text-center mt-12">
          <PrimaryButton href="/news-blogs/">DAHA FAZLA BLOG</PrimaryButton>
        </FadeIn>
      </div>
    </section>
  );
}
