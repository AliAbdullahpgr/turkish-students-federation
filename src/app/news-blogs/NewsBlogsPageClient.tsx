"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import BlogCard from "@/components/ui/BlogCard";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

interface BlogPostItem {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  thumbnail?: string | null;
  publishedAt?: string | null;
  category?: string | null;
}

export default function NewsBlogsPageClient({ posts }: { posts: BlogPostItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const postDate = post.publishedAt ?? "";
    const matchesMonth =
      filterMonth === "" || postDate.startsWith(filterMonth);

    return matchesSearch && matchesMonth;
  });

  return (
    <>
      <PageHero title="Haberler & Blog" accentWord="Blog" />

      <section className="py-section bg-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <FadeIn className="text-center mb-12">
            <SectionEyebrow text="HABERLER & GÜNCELLEMELER" />
            <h2 className="text-section-title font-heading font-bold text-text-primary">
              Son <span className="text-accent">Bloglarımız</span>
            </h2>
            <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
              Makaleleri arayın, aya veya yazara göre filtreleyin ve daha fazla hikaye için kaydırmaya devam edin.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="flex flex-wrap gap-4 mb-10 justify-center">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="flex items-center gap-2 bg-surface rounded-lg px-4 py-2 transition-shadow focus-within:shadow-sm"
              >
                <Search className="w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Blog ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
                />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-2.5 bg-primary text-white rounded-pill text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
              >
                ARA
              </motion.button>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="px-4 py-2.5 bg-surface rounded-lg text-sm text-text-primary outline-none border border-border-custom transition-all focus:border-accent focus:shadow-sm"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-2.5 bg-primary text-white rounded-pill text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Filter className="w-4 h-4" />
                FİLTRELE
              </motion.button>
            </div>
          </FadeIn>

          <AnimatePresence mode="wait">
            <motion.div
              key={searchQuery + filterMonth}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <StaggerContainer
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                staggerDelay={0.1}
              >
                {filteredPosts.map((post) => (
                  <StaggerItem key={post.id}>
                    <BlogCard
                      date={post.publishedAt ?? ""}
                      title={post.title}
                      excerpt={post.excerpt}
                      href={`/news-blogs/${post.slug}/`}
                      isTurkish={true}
                      thumbnail={post.thumbnail ?? undefined}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </motion.div>
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-text-muted">Kriterlerinize uygun blog bulunamadı.</p>
            </motion.div>
          )}

          <FadeIn delay={0.3}>
            <div className="text-center mt-12 text-text-muted text-sm">
              Akışın sonuna ulaştınız.
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
