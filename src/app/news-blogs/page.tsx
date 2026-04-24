"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { blogPosts } from "@/data/blogs";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import BlogCard from "@/components/ui/BlogCard";

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
            <div className="text-center mb-12">
              <SectionEyebrow text="NEWS & UPDATES" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Explore Our Latest <span className="text-accent">Blogs</span>
              </h2>
              <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
                Search articles, filter by month or author, and keep scrolling to
                load more stories in a live feed.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 mb-10 justify-center">
              <div className="flex items-center gap-2 bg-surface rounded-lg px-4 py-2">
                <Search className="w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
                />
              </div>
              <button className="px-6 py-2.5 bg-primary text-white rounded-pill text-sm font-semibold hover:bg-primary-dark transition-colors">
                SEARCH
              </button>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="px-4 py-2.5 bg-surface rounded-lg text-sm text-text-primary outline-none border border-border-custom"
              />
              <button className="px-6 py-2.5 bg-primary text-white rounded-pill text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                FILTER
              </button>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
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

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-text-muted">No blogs found matching your criteria.</p>
              </div>
            )}

            <div className="text-center mt-12 text-text-muted text-sm">
              You reached the end of the feed.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
