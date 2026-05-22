import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

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

      <section className="bg-white py-section">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="mb-10 text-center">
            <SectionEyebrow text="ETKINLIKLER" />
            <h2 className="text-section-title font-heading font-bold text-text-primary">
              Yaklasan ve <span className="text-accent">Gecmis</span> Etkinlikler
            </h2>
          </div>

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
                className="group relative overflow-hidden rounded-md shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex aspect-[3/4] items-center justify-center bg-surface">
                  {event.posterImage ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={event.posterImage}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-2xl font-bold text-primary">{event.title.charAt(0)}</span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-text-primary">{event.title}</h3>
                      <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase text-accent">
                        {event.category}
                      </span>
                      {event.date ? <p className="mt-3 text-sm text-text-muted">{event.date}</p> : null}
                      {event.location ? <p className="mt-1 text-sm text-text-secondary">{event.location}</p> : null}
                    </div>
                  )}
                </div>
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[10px] font-bold text-primary">
                  PTOB
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
