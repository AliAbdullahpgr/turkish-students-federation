"use client";

import { useState } from "react";
import { events } from "@/data/events";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "recent">("upcoming");
  const filteredEvents = events.filter((e) => e.status === activeTab);

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Our Events" accentWord="Events" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-10">
              <SectionEyebrow text="EVENTS" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Upcoming & <span className="text-accent">Recent</span> Events
              </h2>
            </div>

            <div className="flex justify-center mb-10">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                  activeTab === "upcoming"
                    ? "bg-primary text-white"
                    : "bg-surface text-text-secondary hover:text-primary"
                }`}
              >
                UPCOMING
              </button>
              <button
                onClick={() => setActiveTab("recent")}
                className={`px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                  activeTab === "recent"
                    ? "bg-primary text-white"
                    : "bg-surface text-text-secondary hover:text-primary"
                }`}
              >
                RECENT
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="relative rounded-md overflow-hidden shadow-card group"
                >
                  <div className="aspect-[3/4] bg-surface flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {event.title.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">
                        {event.title}
                      </h3>
                      <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase rounded-full">
                        {event.category}
                      </span>
                      {event.date && (
                        <p className="text-sm text-text-muted mt-3">{event.date}</p>
                      )}
                      {event.location && (
                        <p className="text-sm text-text-secondary mt-1">
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[10px] font-bold text-primary">
                    TSF
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
