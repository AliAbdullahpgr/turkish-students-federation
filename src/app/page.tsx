import { Metadata } from "next";
export const revalidate = 60;

import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import HeroSection from "@/components/sections/home/HeroSection";
import AboutIntroCard from "@/components/sections/home/AboutIntroCard";
import EventsPreviewSection from "@/components/sections/home/EventsPreviewSection";
import ActivitiesSection from "@/components/sections/home/ActivitiesSection";
import ImpactHighlightsSection from "@/components/sections/home/ImpactHighlightsSection";
import PresidentSection from "@/components/sections/home/PresidentSection";
import CoursesCarouselSection from "@/components/sections/home/CoursesCarouselSection";
import LatestReleaseSection from "@/components/sections/home/LatestReleaseSection";
import MediaNewsSection from "@/components/sections/home/MediaNewsSection";
import FacebookFeedSection from "@/components/sections/home/FacebookFeedSection";
import { getSiteIdentity, getHomeMessaging } from "@/db/queries/site-settings";
import { getUpcomingEvents, getRecentEvents } from "@/db/queries/events";
import { getAllActivities } from "@/db/queries/activities";
import { getAllCourses } from "@/db/queries/courses";
import { getLatestBlogPosts } from "@/db/queries/blog-posts";

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
  const courses = await getAllCourses();
  const posts = await getLatestBlogPosts(6);

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <HeroSection messaging={messaging} identity={identity} />
        <AboutIntroCard messaging={messaging} identity={identity} />
        <EventsPreviewSection events={allEvents} />
        <ActivitiesSection activities={activities} />
        <ImpactHighlightsSection />
        <PresidentSection />
        <CoursesCarouselSection courses={courses} />
        <LatestReleaseSection />
        <MediaNewsSection posts={posts} />
        <FacebookFeedSection />
      </main>
      <Footer />
    </>
  );
}
