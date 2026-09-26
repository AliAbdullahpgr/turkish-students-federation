"use client";

import Image from "next/image";
import FadeIn from "@/components/animation/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";
import type { HomeContent } from "@/db/queries/home-sections";

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
  content: HomeContent["events"];
}

export default function EventsPreviewSection({ events, content }: EventsPreviewSectionProps) {
  const visibleEvents = events.slice(0, 4);

  return (
    <section className="bg-white py-section border-t border-border-custom">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <FadeIn>
          <SectionHeader
            title={content.title}
            lede={content.lede || undefined}
            action={content.cta && content.href ? { href: content.href, label: content.cta } : undefined}
          />
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.12}>
          {visibleEvents.map((event) => (
            <StaggerItem key={event.id}>
              {/*
                The poster is optional. The title, category and date live outside
                it so they render either way — previously they sat inside the
                no-image branch, so an event that *had* a poster showed no title
                at all.
              */}
              <article className="group flex h-full flex-col overflow-hidden rounded-md border border-border-custom transition-transform duration-300 hover:-translate-y-1">
                {event.posterImage && (
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                    <Image
                      src={event.posterImage}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                )}

                <div className={`flex flex-1 flex-col p-6 ${event.posterImage ? "" : "pt-7"}`}>
                  <span className="mb-2 inline-block self-start rounded-lg bg-accent/10 px-3 py-1 text-xs font-bold uppercase text-accent">
                    {event.category}
                  </span>
                  <h3
                    className={`font-bold text-text-primary ${
                      event.posterImage ? "text-lg" : "text-xl"
                    }`}
                  >
                    {event.title}
                  </h3>
                  {event.date ? <p className="mt-2 text-sm text-text-muted">{event.date}</p> : null}
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
