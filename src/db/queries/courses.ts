import { db } from "@/db/client";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resolveMediaUrls } from "./resolve-media";

export async function getAllCourses() {
  const rows = await db.select().from(courses).all();
  return resolveMediaUrls(rows, "thumbnailMediaId", "thumbnail");
}

export async function getCourseById(id: string) {
  const row = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id))
    .get();
  if (!row) return null;
  const [resolved] = await resolveMediaUrls([row], "thumbnailMediaId", "thumbnail");
  return resolved;
}
