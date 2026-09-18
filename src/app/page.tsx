import { Metadata } from "next";
export const revalidate = 60;

import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import HeroSection from "@/components/sections/home/HeroSection";
import WhoWeAreSection from "@/components/sections/about/WhoWeAreSection";
import EventsPreviewSection from "@/components/sections/home/EventsPreviewSection";
import ActivitiesSection from "@/components/sections/home/ActivitiesSection";
import ActivityPostsSection from "@/components/sections/home/ActivityPostsSection";
import PresidentSection from "@/components/sections/home/PresidentSection";
import CoursesCarouselSection from "@/components/sections/home/CoursesCarouselSection";
import LatestReleaseSection from "@/components/sections/home/LatestReleaseSection";
import MediaNewsSection from "@/components/sections/home/MediaNewsSection";
import FacebookFeedSection from "@/components/sections/home/FacebookFeedSection";
import {
  getSiteIdentity,
  getHomeMessaging,
  getPresidentSection,
  getYoutubeSection,
} from "@/db/queries/site-settings";
import { getUpcomingEvents, getRecentEvents } from "@/db/queries/events";
import { getAllActivities } from "@/db/queries/activities";
import { getAllCourses } from "@/db/queries/courses";
import { getPublishedActivityPosts } from "@/db/queries/activity-posts";
import { getLatestBlogPosts } from "@/db/queries/blog-posts";
import { youtubeEmbedUrl } from "@/lib/youtube";

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getSiteIdentity();
  return {
    title: `Ana Sayfa - ${identity.guideName}`,
    description: identity.guideDescription,
  };
}

export default async function HomePage() {
  const identity = await getSiteIdentity();
  const messaging = await getHomeMessaging();
  const upcomingEvents = await getUpcomingEvents();
  const recentEvents = await getRecentEvents();
  const allEvents = [...upcomingEvents, ...recentEvents];
  const activities = await getAllActivities();
  const activityPosts = await getPublishedActivityPosts(3);
  const courses = await getAllCourses();
  const posts = await getLatestBlogPosts(6);
  const president = await getPresidentSection();
  const youtube = await getYoutubeSection();

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <HeroSection messaging={messaging} identity={identity} />
        <WhoWeAreSection messaging={messaging} identity={identity} />
        {/* Real activities lead the page; renders nothing until one is published. */}
        <ActivityPostsSection activities={activityPosts} />
        <ActivitiesSection activities={activities} />
        <MediaNewsSection posts={posts} />
        <EventsPreviewSection events={allEvents} />
        {president.visible && (
          <PresidentSection
            name={president.name}
            role={president.role}
            bio={president.bio}
            imageUrl={president.imageUrl}
            imageAlt={president.imageAlt}
          />
        )}
        <CoursesCarouselSection courses={courses} />
        {youtube.visible && (
          <LatestReleaseSection
            title={youtube.title}
            description={youtube.description}
            tags={youtube.tags}
            embedUrl={youtubeEmbedUrl(youtube.videoUrl)}
            channelUrl={youtube.channelUrl}
            ctaLabel={youtube.ctaLabel}
          />
        )}
        <FacebookFeedSection />
      </main>
      <Footer />
    </>
  );
}
