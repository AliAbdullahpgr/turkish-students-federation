import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
export const revalidate = 60;

import PageHero from "@/components/ui/PageHero";
import WhoWeAreSection from "@/components/sections/about/WhoWeAreSection";
import MissionVisionSection from "@/components/sections/about/MissionVisionSection";
import CoreValuesSection from "@/components/sections/about/CoreValuesSection";
import KeyActivitiesSection from "@/components/sections/about/KeyActivitiesSection";
import LeadershipTeamSection from "@/components/sections/about/LeadershipTeamSection";
import ImpactNumbersSection from "@/components/sections/about/ImpactNumbersSection";
import CTABannerSection from "@/components/sections/about/CTABannerSection";
import { getSiteIdentity, getHomeMessaging } from "@/db/queries/site-settings";
import { getAllActivities } from "@/db/queries/activities";
import { getActiveTeamMembers } from "@/db/queries/team-members";

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getSiteIdentity();
  return {
    title: `Hakkımızda - ${identity.guideName}`,
    description: identity.description,
  };
}

export default async function AboutUsPage() {
  const identity = await getSiteIdentity();
  const messaging = await getHomeMessaging();
  const activities = await getAllActivities();
  const team = await getActiveTeamMembers();

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title={`${identity.guideName} Hakkında`} accentWord="Öğrenci" />
        <WhoWeAreSection messaging={messaging} identity={identity} />
        <MissionVisionSection />
        <CoreValuesSection />
        <KeyActivitiesSection activities={activities} />
        <LeadershipTeamSection members={team} />
        <ImpactNumbersSection />
        <CTABannerSection />
      </main>
      <Footer />
    </>
  );
}
