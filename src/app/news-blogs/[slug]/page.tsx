import { Metadata } from "next";
export const revalidate = 60;

import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import { getBlogPostBySlug } from "@/db/queries/blog-posts";

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

        <section className="py-section bg-white">
          <div className="max-w-[800px] mx-auto px-6 lg:px-12">
            <div className="mb-8">
              <SectionEyebrow text={post.category?.toUpperCase() || "BLOG"} />
              <h1 className="text-[clamp(28px,4vw,42px)] font-extrabold text-text-primary leading-tight mb-4">
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

            <div className="bg-surface rounded-[16px] p-8 lg:p-10">
              <p className="text-body text-text-secondary leading-relaxed mb-6">
                {post.excerpt}
              </p>
              {post.body && (
                <article className="prose prose-slate max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.body}
                  </ReactMarkdown>
                </article>
              )}
              {!post.body && (
                <p className="text-body text-text-secondary leading-relaxed">
                  Bu makale, Türk Öğrenci Federasyonu&apos;nun öğrenciler için yürüttüğü
                  çalışmaları ve faaliyetleri ele almaktadır. Federasyonumuz, öğrencilerin
                  sesi olmaya ve onların haklarını savunmaya devam edecektir.
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
