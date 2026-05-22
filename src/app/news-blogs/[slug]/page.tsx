import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Footer from "@/components/layout/FooterRSC";
import Navigation from "@/components/layout/NavigationRSC";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import { getBlogPostBySlug } from "@/db/queries/blog-posts";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Not Found - Turkish Student Federation" };
  }

  return {
    title: `${post.title} - Turkish Student Federation`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title={post.title} accentWord={post.title.split(" ").pop() || "Post"} />

        <section className="bg-white py-section">
          <div className="mx-auto max-w-[800px] px-6 lg:px-12">
            <div className="mb-8">
              <SectionEyebrow text={post.category?.toUpperCase() || "BLOG"} />
              <h1 className="mb-4 text-[clamp(28px,4vw,42px)] font-extrabold leading-tight text-text-primary">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span className="font-semibold text-accent">{post.publishedAt}</span>
                {post.author && (
                  <>
                    <span>|</span>
                    <span>{post.author}</span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-[16px] bg-surface p-8 lg:p-10">
              <p className="mb-6 text-body leading-relaxed text-text-secondary">{post.excerpt}</p>
              {post.body && (
                <article className="prose prose-slate max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
                </article>
              )}
              {!post.body && (
                <p className="text-body leading-relaxed text-text-secondary">
                  Bu makale, Turk Ogrenci Federasyonu&apos;nun ogrenciler icin yuruttugu
                  calismalari ve faaliyetleri ele almaktadir. Federasyonumuz, ogrencilerin sesi
                  olmaya ve onlarin haklarini savunmaya devam edecektir.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
