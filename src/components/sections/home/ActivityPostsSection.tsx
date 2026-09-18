"use client";

import PostCard from "@/components/ui/PostCard";
import FadeIn from "@/components/animation/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";

interface ActivityPostItem {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  thumbnail?: string | null;
  category?: string | null;
  location?: string | null;
  happenedAt?: string | null;
}

interface ActivityPostsSectionProps {
  activities: ActivityPostItem[];
}

/**
 * Activities the association actually ran, presented like the blog grid.
 *
 * Renders nothing at all until an activity has been published from the admin —
 * an empty "Faaliyetlerimiz" heading over a blank row is worse than no section,
 * and this one sits high on the page where that would be most obvious.
 */
export default function ActivityPostsSection({ activities }: ActivityPostsSectionProps) {
  if (activities.length === 0) return null;

  const visible = activities.slice(0, 3);

  return (
    <section
      className="bg-white py-section border-t border-border-custom"
      aria-labelledby="home-activities-title"
    >
      <div className="mx-auto w-full max-w-[1280px] min-w-0 px-6 lg:px-12">
        <FadeIn>
          <SectionHeader
            titleId="home-activities-title"
            title="Faaliyetlerimiz"
            lede="Birliğimizin gerçekleştirdiği ziyaretler, buluşmalar ve programlar."
            action={{ href: "/faaliyetler/", label: "Tüm faaliyetler" }}
          />
        </FadeIn>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((activity) => (
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
      </div>
    </section>
  );
}
