import { Filter, Search } from "lucide-react";
import BlogCard from "@/components/ui/BlogCard";
import FadeIn from "@/components/animation/FadeIn";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
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

interface NewsBlogsPageClientProps {
  posts: BlogPostItem[];
  searchQuery: string;
  filterMonth: string;
}

export default function NewsBlogsPageClient({
  posts,
  searchQuery,
  filterMonth,
}: NewsBlogsPageClientProps) {
  return (
    <>
      <PageHero title="Haberler & Blog" accentWord="Blog" />

      <section className="bg-white py-section">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <FadeIn className="mb-12 text-center">
            <SectionEyebrow text="HABERLER & GUNCELLEMELER" />
            <h2 className="text-section-title font-heading font-bold text-text-primary">
              Son <span className="text-accent">Bloglarimiz</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[600px] text-body text-text-secondary">
              Makaleleri arayin, aya gore filtreleyin ve daha fazla hikaye icin kaydirmaya devam edin.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <form action="/news-blogs" method="get" className="mb-10 flex flex-wrap justify-center gap-4">
              <label className="flex items-center gap-2 rounded-lg bg-surface px-4 py-2 transition-shadow focus-within:shadow-sm">
                <Search className="h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Blog ara..."
                  className="bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                />
              </label>
              <button
                type="submit"
                className="cursor-pointer rounded-pill bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                ARA
              </button>
              <input
                type="month"
                name="month"
                defaultValue={filterMonth}
                className="rounded-lg border border-border-custom bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition-all focus:border-accent focus:shadow-sm"
              />
              <button
                type="submit"
                className="flex cursor-pointer items-center gap-2 rounded-pill bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                <Filter className="h-4 w-4" />
                FILTRELE
              </button>
            </form>
          </FadeIn>

          {posts.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
              {posts.map((post) => (
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
          ) : (
            <div className="py-16 text-center">
              <p className="text-text-muted">Kriterlerinize uygun blog bulunamadi.</p>
            </div>
          )}

          <FadeIn delay={0.3}>
            <div className="mt-12 text-center text-sm text-text-muted">Akisin sonuna ulastiniz.</div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
