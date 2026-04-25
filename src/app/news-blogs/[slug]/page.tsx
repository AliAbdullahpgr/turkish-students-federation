import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogs";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Not Found - Turkish Student Federation",
    };
  }

  return {
    title: `${post.title} - Turkish Student Federation`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const displayTitle = post.titleTurkish || post.title;
  const displayExcerpt = post.excerptTurkish || post.excerpt;

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
                {displayTitle}
              </h1>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span className="font-semibold text-accent">{post.date}</span>
                <span>|</span>
                <span>{post.author}</span>
              </div>
            </div>

            {post.thumbnail && (
              <div className="rounded-[16px] overflow-hidden mb-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.thumbnail}
                  alt={displayTitle}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div className="bg-surface rounded-[16px] p-8 lg:p-10">
              <p className="text-body text-text-secondary leading-relaxed mb-6">
                {displayExcerpt}
              </p>
              <p className="text-body text-text-secondary leading-relaxed mb-6">
                {post.isTurkish
                  ? "Bu makale, Türk Öğrenci Federasyonu'nun öğrenciler için yürüttüğü çalışmaları ve faaliyetleri ele almaktadır. Federasyonumuz, öğrencilerin sesi olmaya ve onların haklarını savunmaya devam edecektir."
                  : "This article discusses the work and activities carried out by the Turkish Student Federation for students. Our federation will continue to be the voice of students and defend their rights."}
              </p>
              <p className="text-body text-text-secondary leading-relaxed">
                {post.isTurkish
                  ? "Daha fazla bilgi için bizi sosyal medya hesaplarımızdan takip edebilir veya iletişim sayfamızdan bize ulaşabilirsiniz."
                  : "For more information, you can follow us on our social media accounts or contact us through our contact page."}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
