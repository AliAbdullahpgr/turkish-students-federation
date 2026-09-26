"use client";

import PostCard from "@/components/ui/PostCard";
import { formatActivityDate } from "@/lib/format-date";
import FadeIn from "@/components/animation/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import type { HomeContent } from "@/db/queries/home-sections";

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
  content: HomeContent["activityPosts"];
}

/**
 * Activities the association actually ran, presented like the blog grid.
 *
 * Renders nothing at all until an activity has been published from the admin —
 * an empty "Faaliyetlerimiz" heading over a blank row is worse than no section,
 * and this one sits high on the page where that would be most obvious.
 */
export default function ActivityPostsSection({ activities, content }: ActivityPostsSectionProps) {
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
            title={content.title}
            lede={content.lede || undefined}
            action={content.cta && content.href ? { href: content.href, label: content.cta } : undefined}
          />
        </FadeIn>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((activity) => (
            <PostCard
              key={activity.id}
              title={activity.title}
              excerpt={activity.excerpt}
              href={`/faaliyetler/${activity.slug}/`}
              date={formatActivityDate(activity.happenedAt)}
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
