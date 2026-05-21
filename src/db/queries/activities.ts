import { db } from "@/db/client";
import { activities } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getAllActivities() {
  return db
    .select()
    .from(activities)
    .orderBy(asc(activities.sortOrder))
    .all();
}

export async function getActivityById(id: string) {
  return db
    .select()
    .from(activities)
    .where(eq(activities.id, id))
    .get();
}
