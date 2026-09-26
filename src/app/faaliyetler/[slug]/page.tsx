import { Metadata } from "next";
import { formatActivityDate } from "@/lib/format-date";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Footer from "@/components/layout/FooterRSC";
import Navigation from "@/components/layout/NavigationRSC";
import { getActivityPostBySlug } from "@/db/queries/activity-posts";
import { readingTime } from "@/lib/reading-time";

export const revalidate = 60;

interface ActivityPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getActivityPostBySlug(slug);

  if (!activity) {
    return { title: "Not Found - Pakistan Türk Öğrenci Birliği" };
  }

  return {
    title: `${activity.title} - Pakistan Türk Öğrenci Birliği`,
    description: activity.excerpt,
  };
}

export default async function ActivityDetailPage({ params }: ActivityPageProps) {
  const { slug } = await params;
  const activity = await getActivityPostBySlug(slug);

  if (!activity) notFound();

  const minutes = readingTime(activity.body || activity.excerpt || "");
  const meta = [activity.location, formatActivityDate(activity.happenedAt)].filter(Boolean);

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow bg-white">
        <article className="pb-24 pt-12 lg:pt-16">
          <header className="mx-auto max-w-[680px] px-6">
            {activity.category && (
              <Link
                href="/faaliyetler/"
                className="text-[13px] font-semibold text-accent no-underline hover:text-primary"
              >
                {activity.category}
              </Link>
            )}

            <h1 className="mt-3 text-[clamp(32px,5vw,46px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-text-primary">
              {activity.title}
            </h1>

            {activity.excerpt && (
              <p className="mt-4 text-[clamp(18px,2.2vw,21px)] leading-[1.5] text-text-secondary">
                {activity.excerpt}
              </p>
            )}

            <div className="mt-8 border-y border-border-custom py-4 text-sm text-text-muted">
              {[...meta, minutes ? `${minutes} dk okuma` : null].filter(Boolean).join(" · ")}
            </div>
          </header>

          {activity.thumbnail && (
            <figure className="mx-auto mt-10 max-w-[1000px] px-6">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[16px] bg-primary/5">
                <Image
                  src={activity.thumbnail}
                  alt={activity.title}
                  fill
                  sizes="(max-width: 1000px) 100vw, 1000px"
                  className="object-cover"
                  priority
                />
              </div>
            </figure>
          )}

          <div className="mx-auto mt-10 max-w-[680px] px-6">
            {activity.body ? (
              <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:tracking-[-0.01em] prose-headings:text-text-primary prose-h2:mt-12 prose-h2:text-[28px] prose-h3:mt-10 prose-h3:text-[22px] prose-p:text-[19px] prose-p:leading-[1.75] prose-p:text-[#242424] prose-a:text-accent prose-a:underline-offset-2 prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:not-italic prose-blockquote:text-text-secondary prose-li:text-[19px] prose-li:leading-[1.75] prose-li:text-[#242424] prose-img:rounded-[16px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{activity.body}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-[19px] leading-[1.75] text-[#242424]">{activity.excerpt}</p>
            )}
          </div>

          <div className="mx-auto mt-14 max-w-[680px] px-6">
            <Link
              href="/faaliyetler/"
              className="text-sm font-bold text-accent no-underline hover:text-primary"
            >
              ← Tüm faaliyetler
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
