import { db } from "@/db/client";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resolveMediaUrls } from "./resolve-media";

export async function getAllEvents() {
  const rows = await db.select().from(events).all();
  return resolveMediaUrls(rows, "posterMediaId", "posterImage");
}

export async function getUpcomingEvents() {
  const rows = await db
    .select()
    .from(events)
    .where(eq(events.status, "upcoming"))
    .all();
  return resolveMediaUrls(rows, "posterMediaId", "posterImage");
}

export async function getRecentEvents() {
  const rows = await db
    .select()
    .from(events)
    .where(eq(events.status, "recent"))
    .all();
  return resolveMediaUrls(rows, "posterMediaId", "posterImage");
}

export async function getEventById(id: string) {
  const row = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .get();
  if (!row) return null;
  const [resolved] = await resolveMediaUrls([row], "posterMediaId", "posterImage");
  return resolved;
}
