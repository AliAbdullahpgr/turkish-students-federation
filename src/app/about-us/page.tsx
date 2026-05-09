import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import WhoWeAreSection from "@/components/sections/about/WhoWeAreSection";
import MissionVisionSection from "@/components/sections/about/MissionVisionSection";
import CoreValuesSection from "@/components/sections/about/CoreValuesSection";
import KeyActivitiesSection from "@/components/sections/about/KeyActivitiesSection";
import LeadershipTeamSection from "@/components/sections/about/LeadershipTeamSection";
import ImpactNumbersSection from "@/components/sections/about/ImpactNumbersSection";
import CTABannerSection from "@/components/sections/about/CTABannerSection";

export const metadata: Metadata = {
  title: "Hakkımızda - Pakistan Türk Öğrenci Birliği",
  description:
    "Pakistan Türk Öğrenci Birliği hakkında bilgi edinin. Pakistan'da eğitim gören Türk öğrencilere destek olan kardeşlik ve rehberlik topluluğu.",
};

export default function AboutUsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Pakistan Türk Öğrenci Birliği Hakkında" accentWord="Öğrenci" />
        <WhoWeAreSection />
        <MissionVisionSection />
        <CoreValuesSection />
        <KeyActivitiesSection />
        <LeadershipTeamSection />
        <ImpactNumbersSection />
        <CTABannerSection />
      </main>
      <Footer />
    </>
  );
}
