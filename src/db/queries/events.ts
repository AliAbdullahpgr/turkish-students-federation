import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { events, media } from "@/db/schema";
import { events as fallbackEvents } from "@/data/events";

const eventFallbacks = fallbackEvents.map((event) => ({
  ...event,
  posterMediaId: null,
  createdAt: null,
}));

const eventSelection = {
  id: events.id,
  title: events.title,
  posterMediaId: events.posterMediaId,
  posterImage: media.secureUrl,
  category: events.category,
  status: events.status,
  date: events.date,
  location: events.location,
  createdAt: events.createdAt,
};

export async function getAllEvents() {
  try { return await db
    .select(eventSelection)
    .from(events)
    .leftJoin(media, eq(events.posterMediaId, media.id))
    .all(); } catch { return eventFallbacks; }
}

export async function getUpcomingEvents() {
  try { return await db
    .select(eventSelection)
    .from(events)
    .leftJoin(media, eq(events.posterMediaId, media.id))
    .where(eq(events.status, "upcoming"))
    .all(); } catch { return eventFallbacks.filter((event) => event.status === "upcoming"); }
}

export async function getRecentEvents() {
  try { return await db
    .select(eventSelection)
    .from(events)
    .leftJoin(media, eq(events.posterMediaId, media.id))
    .where(eq(events.status, "recent"))
    .all(); } catch { return eventFallbacks.filter((event) => event.status === "recent"); }
}

export async function getEventById(id: string) {
  return db
    .select(eventSelection)
    .from(events)
    .leftJoin(media, eq(events.posterMediaId, media.id))
    .where(eq(events.id, id))
    .get();
}
