import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
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

export const metadata: Metadata = {
  title: "Ana Sayfa - Pakistan Türk Öğrenci Birliği",
  description:
    "Pakistan Türk Öğrenci Birliği, Pakistan'da eğitim gören Türk öğrencilere destek olan bir kardeşlik ve rehberlik topluluğudur.",
};

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <HeroSection />
        <AboutIntroCard />
        <EventsPreviewSection />
        <ActivitiesSection />
        <ImpactHighlightsSection />
        <PresidentSection />
        <CoursesCarouselSection />
        <LatestReleaseSection />
        <MediaNewsSection />
        <FacebookFeedSection />
      </main>
      <Footer />
    </>
  );
}
