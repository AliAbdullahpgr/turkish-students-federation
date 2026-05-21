import { Metadata } from "next";
export const revalidate = 60;

import EventsPageClient from "./EventsPageClient";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import { getAllEvents } from "@/db/queries/events";

export const metadata: Metadata = {
  title: "Etkinlikler - Turkish Student Federation",
};

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <EventsPageClient events={events} />
      </main>
      <Footer />
    </>
  );
}
