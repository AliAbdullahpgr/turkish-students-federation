"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { blogPosts } from "@/data/blogs";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import BlogCard from "@/components/ui/BlogCard";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

export default function NewsBlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMonth =
      filterMonth === "" || post.dateISO.startsWith(filterMonth);

    return matchesSearch && matchesMonth;
  });

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="News & Blogs" accentWord="Blogs" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <FadeIn className="text-center mb-12">
              <SectionEyebrow text="NEWS & UPDATES" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Explore Our Latest <span className="text-accent">Blogs</span>
              </h2>
              <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
                Search articles, filter by month or author, and keep scrolling to
                load more stories in a live feed.
              </p>
            </FadeIn>

            {/* Filter Bar */}
            <FadeIn delay={0.15}>
              <div className="flex flex-wrap gap-4 mb-10 justify-center">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="flex items-center gap-2 bg-surface rounded-lg px-4 py-2 transition-shadow focus-within:shadow-sm"
                >
                  <Search className="w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search blogs..."
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
                  SEARCH
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
                  FILTER
                </motion.button>
              </div>
            </FadeIn>

            {/* Blog Grid */}
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
              </motion.div>
            </AnimatePresence>

            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-text-muted">No blogs found matching your criteria.</p>
              </motion.div>
            )}

            <FadeIn delay={0.3}>
              <div className="text-center mt-12 text-text-muted text-sm">
                You reached the end of the feed.
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
