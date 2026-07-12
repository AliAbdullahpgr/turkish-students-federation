import { Filter, Search } from "lucide-react";
import BlogCard from "@/components/ui/BlogCard";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

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
  type: string;
}

export default function NewsBlogsPageClient({
  posts,
  searchQuery,
  filterMonth,
  type,
}: NewsBlogsPageClientProps) {
  return (
    <>
      <PageHero title={type === "news" ? "Haberler" : "Blog"} accentWord={type === "news" ? "Haberler" : "Blog"} />

      <section className="bg-white py-section">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="mb-12 text-center">
            <SectionEyebrow text={type === "news" ? "GÜNCEL GELİŞMELER" : "ÖĞRENCİ YAŞAMI"} />
            <h2 className="text-section-title font-heading font-bold text-text-primary">
              {type === "news" ? "Son Haberler" : <>Son <span className="text-accent">Bloglarımız</span></>}
            </h2>
            <p className="mx-auto mt-4 max-w-[600px] text-body text-text-secondary">
              Makaleleri arayin, aya gore filtreleyin ve daha fazla hikaye icin kaydirmaya devam edin.
            </p>
          </div>

          <div>
            <form action="/news-blogs" method="get" className="mb-10 flex flex-wrap justify-center gap-4">
              <input type="hidden" name="type" value={type} />
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
                className="cursor-pointer rounded-pill bg-action px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-action-dark"
              >
                ARA
              </button>
              <input
                type="month"
                name="month"
                defaultValue={filterMonth}
                className="rounded-lg border border-border-custom bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition-all focus:border-action focus:shadow-sm"
              />
              <button
                type="submit"
                className="flex cursor-pointer items-center gap-2 rounded-pill bg-action px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-action-dark"
              >
                <Filter className="h-4 w-4" />
                FILTRELE
              </button>
            </form>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post.id}>
                  <BlogCard
                    date={post.publishedAt ?? ""}
                    title={post.title}
                    excerpt={post.excerpt}
                    href={`/news-blogs/${post.slug}/`}
                    isTurkish={true}
                    thumbnail={post.thumbnail ?? undefined}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-text-muted">Kriterlerinize uygun içerik bulunamadı.</p>
            </div>
          )}

          <div>
            <div className="mt-12 text-center text-sm text-text-muted">Akisin sonuna ulastiniz.</div>
          </div>
        </div>
      </section>
    </>
  );
}
