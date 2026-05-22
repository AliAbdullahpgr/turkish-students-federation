import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Footer from "@/components/layout/FooterRSC";
import Navigation from "@/components/layout/NavigationRSC";
import { getRecentEvents, getUpcomingEvents } from "@/db/queries/events";
import EventsPageClient from "./EventsPageClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Etkinlikler - Turkish Student Federation",
};

interface EventsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { status } = await searchParams;
  const activeTab = status === "recent" ? "recent" : "upcoming";
  const events = activeTab === "recent" ? await getRecentEvents() : await getUpcomingEvents();

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <EventsPageClient events={events} activeTab={activeTab} />
      </main>
      <Footer />
    </>
  );
}
