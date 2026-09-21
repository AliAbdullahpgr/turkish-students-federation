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
  getPresidentSection,
  getYoutubeSection,
} from "@/db/queries/site-settings";
import { getHomeContent } from "@/db/queries/home-sections";
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
  const home = await getHomeContent();
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
        <HeroSection hero={home.hero} />
        {home.whoWeAre.visible && <WhoWeAreSection content={home.whoWeAre} />}
        {/*
          Real activities lead the page. Each of these bands also drops out when
          it has nothing to show, so an editor who has not filled a section yet
          gets no empty heading over a blank row.
        */}
        {home.activityPosts.visible && activityPosts.length > 0 && (
          <ActivityPostsSection activities={activityPosts} content={home.activityPosts} />
        )}
        {home.whatWeDo.visible && activities.length > 0 && (
          <ActivitiesSection activities={activities} content={home.whatWeDo} />
        )}
        {home.blog.visible && posts.length > 0 && (
          <MediaNewsSection posts={posts} content={home.blog} />
        )}
        {home.events.visible && allEvents.length > 0 && (
          <EventsPreviewSection events={allEvents} content={home.events} />
        )}
        {president.visible && (
          <PresidentSection
            name={president.name}
            role={president.role}
            bio={president.bio}
            imageUrl={president.imageUrl}
            imageAlt={president.imageAlt}
          />
        )}
        {home.courses.visible && courses.length > 0 && (
          <CoursesCarouselSection courses={courses} content={home.courses} />
        )}
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
        {home.facebook.visible && <FacebookFeedSection content={home.facebook} />}
      </main>
      <Footer />
    </>
  );
}
