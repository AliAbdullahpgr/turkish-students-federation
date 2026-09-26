import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";

interface EventItem {
  id: string;
  title: string;
  posterMediaId?: string | null;
  posterImage?: string | null;
  category?: string | null;
  status: "upcoming" | "recent";
  date?: string | null;
  location?: string | null;
}

interface EventsPageClientProps {
  events: EventItem[];
  activeTab: "upcoming" | "recent";
}

function buildStatusHref(status: "upcoming" | "recent") {
  return status === "upcoming" ? "/events" : "/events?status=recent";
}

export default function EventsPageClient({ events, activeTab }: EventsPageClientProps) {
  return (
    <>
      <PageHero title="Etkinliklerimiz" accentWord="Etkinlikler" />

      <section className="bg-white py-section border-t border-border-custom">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <SectionHeader
            title={<>Yaklaşan ve <span className="text-accent">Geçmiş</span> Etkinlikler</>}
          />

          <div className="mb-10 flex justify-center">
            {(["upcoming", "recent"] as const).map((status) => (
              <Link
                key={status}
                href={buildStatusHref(status)}
                prefetch={false}
                className={`px-8 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                  activeTab === status
                    ? "bg-primary text-white"
                    : "bg-surface text-text-secondary hover:text-primary"
                }`}
              >
                {status === "upcoming" ? "YAKLASAN" : "GECMIS"}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="group flex h-full flex-col overflow-hidden rounded-md border border-border-custom transition-transform duration-300 hover:-translate-y-1"
              >
                {event.posterImage && (
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                    <Image
                      src={event.posterImage}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[10px] font-bold text-primary">
                      PTOB
                    </div>
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
                  {event.location ? (
                    <p className="mt-1 text-sm text-text-secondary">{event.location}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
