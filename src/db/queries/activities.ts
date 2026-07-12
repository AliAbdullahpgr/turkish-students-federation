import { db } from "@/db/client";
import { activities } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { activities as fallbackActivities } from "@/data/activities";
import { staticFallbackOrThrow } from "@/db/queries/static-fallback";

export async function getAllActivities() {
  try { return await db
    .select()
    .from(activities)
    .orderBy(asc(activities.sortOrder))
    .all(); } catch (error) { return staticFallbackOrThrow(error, fallbackActivities.map((activity, sortOrder) => ({ ...activity, sortOrder }))); }
}

export async function getActivityById(id: string) {
  return db
    .select()
    .from(activities)
    .where(eq(activities.id, id))
    .get();
}
