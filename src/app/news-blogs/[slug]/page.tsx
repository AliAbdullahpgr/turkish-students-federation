import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Footer from "@/components/layout/FooterRSC";
import Navigation from "@/components/layout/NavigationRSC";
import { getBlogPostBySlug } from "@/db/queries/blog-posts";
import { readingTime } from "@/lib/reading-time";

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

  const author = post.author || "Pakistan Türk Öğrenci Birliği";
  const minutes = readingTime(post.body || post.excerpt || "");

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow bg-white">
        <article className="pb-24 pt-12 lg:pt-16">
          {/* Header sits on the reading measure, not the page measure. */}
          <header className="mx-auto max-w-[680px] px-6">
            {post.category && (
              <Link
                href="/news-blogs/?type=blog"
                className="text-[13px] font-semibold text-accent no-underline hover:text-primary"
              >
                {post.category}
              </Link>
            )}

            <h1 className="mt-3 text-[clamp(32px,5vw,46px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-text-primary">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-4 text-[clamp(18px,2.2vw,21px)] leading-[1.5] text-text-secondary">
                {post.excerpt}
              </p>
            )}

            {/* Byline: hairlines above and below, no card and no tint. */}
            <div className="mt-8 flex items-center gap-3 border-y border-border-custom py-4">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
              >
                {author.trim().charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 text-sm">
                <p className="truncate font-semibold text-text-primary">{author}</p>
                <p className="text-text-muted">
                  {post.publishedAt}
                  {minutes ? ` · ${minutes} dk okuma` : ""}
                </p>
              </div>
            </div>
          </header>

          {/* The feature image is allowed to run wider than the text. */}
          {post.thumbnail && (
            <figure className="mx-auto mt-10 max-w-[1000px] px-6">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[16px] bg-primary/5">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1000px) 100vw, 1000px"
                  className="object-cover"
                  priority
                />
              </div>
            </figure>
          )}

          <div className="mx-auto mt-10 max-w-[680px] px-6">
            {post.body ? (
              <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:tracking-[-0.01em] prose-headings:text-text-primary prose-h2:mt-12 prose-h2:text-[28px] prose-h3:mt-10 prose-h3:text-[22px] prose-p:text-[19px] prose-p:leading-[1.75] prose-p:text-[#242424] prose-a:text-accent prose-a:underline-offset-2 prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:not-italic prose-blockquote:text-text-secondary prose-li:text-[19px] prose-li:leading-[1.75] prose-li:text-[#242424] prose-img:rounded-[16px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-[19px] leading-[1.75] text-[#242424]">{post.excerpt}</p>
            )}
          </div>

          <div className="mx-auto mt-14 max-w-[680px] px-6">
            <Link
              href="/news-blogs/"
              className="text-sm font-bold text-accent no-underline hover:text-primary"
            >
              ← Tüm yazılar
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
