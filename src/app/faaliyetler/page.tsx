import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Footer from "@/components/layout/FooterRSC";
import Navigation from "@/components/layout/NavigationRSC";
import PostCard from "@/components/ui/PostCard";
import { getPublishedActivityPosts } from "@/db/queries/activity-posts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Faaliyetler - Pakistan Türk Öğrenci Birliği",
  description: "Birliğimizin gerçekleştirdiği ziyaretler, buluşmalar ve programlar.",
};

export default async function ActivitiesPage() {
  const activities = await getPublishedActivityPosts();

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow bg-white">
        <section className="pb-section pt-12 lg:pt-16">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
            <header className="mb-10 border-b border-border-custom pb-6">
              <h1 className="text-[clamp(30px,4.5vw,42px)] font-extrabold tracking-[-0.02em] text-text-primary">
                Faaliyetlerimiz
              </h1>
              <p className="mt-3 max-w-[60ch] text-[17px] leading-relaxed text-text-secondary">
                Birliğimizin gerçekleştirdiği ziyaretler, buluşmalar ve programlar.
              </p>
            </header>

            {activities.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {activities.map((activity) => (
                  <PostCard
                    key={activity.id}
                    title={activity.title}
                    excerpt={activity.excerpt}
                    href={`/faaliyetler/${activity.slug}/`}
                    date={activity.happenedAt?.slice(0, 10) ?? undefined}
                    category={activity.category ?? undefined}
                    author={activity.location ?? undefined}
                    thumbnail={activity.thumbnail ?? undefined}
                  />
                ))}
              </div>
            ) : (
              <p className="text-text-muted">Henüz faaliyet yayınlanmadı.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
