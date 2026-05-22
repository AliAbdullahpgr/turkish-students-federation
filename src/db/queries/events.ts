import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { events, media } from "@/db/schema";

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
  return db
    .select(eventSelection)
    .from(events)
    .leftJoin(media, eq(events.posterMediaId, media.id))
    .all();
}

export async function getUpcomingEvents() {
  return db
    .select(eventSelection)
    .from(events)
    .leftJoin(media, eq(events.posterMediaId, media.id))
    .where(eq(events.status, "upcoming"))
    .all();
}

export async function getRecentEvents() {
  return db
    .select(eventSelection)
    .from(events)
    .leftJoin(media, eq(events.posterMediaId, media.id))
    .where(eq(events.status, "recent"))
    .all();
}

export async function getEventById(id: string) {
  return db
    .select(eventSelection)
    .from(events)
    .leftJoin(media, eq(events.posterMediaId, media.id))
    .where(eq(events.id, id))
    .get();
}
