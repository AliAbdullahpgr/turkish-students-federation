import { db } from "@/db/client";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllEvents() {
  return db.select().from(events).all();
}

export async function getUpcomingEvents() {
  return db
    .select()
    .from(events)
    .where(eq(events.status, "upcoming"))
    .all();
}

export async function getRecentEvents() {
  return db
    .select()
    .from(events)
    .where(eq(events.status, "recent"))
    .all();
}

export async function getEventById(id: string) {
  return db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .get();
}
