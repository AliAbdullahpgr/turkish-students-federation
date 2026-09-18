import { Filter, Search } from "lucide-react";
import ArticleRow from "@/components/ui/ArticleRow";

interface BlogPostItem {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  thumbnail?: string | null;
  publishedAt?: string | null;
  category?: string | null;
  author?: string | null;
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
      <section className="bg-white pb-section pt-12 lg:pt-16">
        <div className="max-w-[760px] mx-auto px-6">
          <header className="mb-10 border-b border-border-custom pb-6">
            <h1 className="text-[clamp(30px,4.5vw,42px)] font-extrabold tracking-[-0.02em] text-text-primary">
              {type === "news" ? "Haberler" : "Blog"}
            </h1>
            <p className="mt-3 text-[17px] leading-relaxed text-text-secondary">
              {type === "news"
                ? "Birliğimizden son haberler ve duyurular."
                : "Pakistan'da öğrenci hayatı için hikâyeler, bilgiler ve pratik öneriler."}
            </p>
          </header>

          <div>
            <form action="/news-blogs" method="get" className="mb-10 flex flex-wrap gap-3">
              <input type="hidden" name="type" value={type} />
              <label className="flex items-center gap-2 rounded-lg bg-surface px-4 py-2 transition-colors focus-within:ring-2 focus-within:ring-action/40">
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
                className="cursor-pointer rounded-xl bg-action px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-action-dark"
              >
                ARA
              </button>
              <input
                type="month"
                name="month"
                aria-label="Aya göre filtrele"
                defaultValue={filterMonth}
                className="rounded-lg border border-border-custom bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition-all focus:border-action"
              />
              <button
                type="submit"
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-action px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-action-dark"
              >
                <Filter className="h-4 w-4" />
                FILTRELE
              </button>
            </form>
          </div>

          {posts.length > 0 ? (
            <div>
              {posts.map((post) => (
                <ArticleRow
                  key={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  href={`/news-blogs/${post.slug}/`}
                  date={post.publishedAt ?? undefined}
                  author={post.author ?? undefined}
                  category={post.category ?? undefined}
                  thumbnail={post.thumbnail ?? undefined}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-text-muted">Kriterlerinize uygun içerik bulunamadı.</p>
            </div>
          )}

          <div>
            <div className="mt-10 text-sm text-text-muted">Akışın sonuna ulaştınız.</div>
          </div>
        </div>
      </section>
    </>
  );
}
