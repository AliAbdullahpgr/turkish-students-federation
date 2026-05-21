import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
export const revalidate = 60;

import PageHero from "@/components/ui/PageHero";
import { getSiteIdentity } from "@/db/queries/site-settings";
import { getGuideSectionTree } from "@/db/queries/guide-sections";
import GuidePageClient from "./GuidePageClient";

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getSiteIdentity();
  return {
    title: `${identity.guideName} - ${identity.name}`,
    description: identity.guideDescription,
  };
}

export default async function PakistanGuidePage() {
  const identity = await getSiteIdentity();
  const guideTree = await getGuideSectionTree();

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero
          title="Pakistan Öğrenci Rehberi"
          accentWord="Öğrenci"
          backgroundImage="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1920&q=80"
        />
        <GuidePageClient
          guideTree={guideTree}
          guideDescription={identity.guideDescription}
        />
      </main>
      <Footer />
    </>
  );
}
