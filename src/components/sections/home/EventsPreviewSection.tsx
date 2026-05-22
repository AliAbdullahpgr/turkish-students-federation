"use client";

import { useState } from "react";
import Image from "next/image";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

interface EventItem {
  id: string;
  title: string;
  posterImage?: string | null;
  category?: string | null;
  status: "upcoming" | "recent";
  date?: string | null;
  location?: string | null;
}

interface EventsPreviewSectionProps {
  events: EventItem[];
}

export default function EventsPreviewSection({ events }: EventsPreviewSectionProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "recent">("upcoming");
  const filteredEvents = events.filter((event) => event.status === activeTab);

  return (
    <section className="bg-white py-section">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <FadeIn className="mb-10 text-center">
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Etkinliklerimiz
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} className="mb-10 flex justify-center">
          <div className="inline-flex overflow-hidden rounded-lg shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`cursor-pointer px-8 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === "upcoming"
                  ? "bg-primary text-white"
                  : "bg-surface text-text-secondary hover:text-primary"
              }`}
            >
              YAKLASAN
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={`cursor-pointer px-8 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === "recent"
                  ? "bg-primary text-white"
                  : "bg-surface text-text-secondary hover:text-primary"
              }`}
            >
              GECMIS
            </button>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-2" staggerDelay={0.12}>
          {filteredEvents.map((event) => (
            <StaggerItem key={event.id}>
              <article className="group relative cursor-pointer overflow-hidden rounded-md shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="flex aspect-[3/4] items-center justify-center bg-surface">
                  {event.posterImage ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={event.posterImage}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-2xl font-bold text-primary">
                          {event.title.charAt(0)}
                        </span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-text-primary">{event.title}</h3>
                      <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase text-accent">
                        {event.category}
                      </span>
                      {event.date ? <p className="mt-3 text-sm text-text-muted">{event.date}</p> : null}
                    </div>
                  )}
                </div>
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[10px] font-bold text-primary">
                  TSF
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
