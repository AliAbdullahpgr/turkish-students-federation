import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { courses, media } from "@/db/schema";

const courseSelection = {
  id: courses.id,
  title: courses.title,
  instructor: courses.instructor,
  description: courses.description,
  thumbnailMediaId: courses.thumbnailMediaId,
  thumbnail: media.secureUrl,
  href: courses.href,
  createdAt: courses.createdAt,
};

export async function getAllCourses() {
  return db
    .select(courseSelection)
    .from(courses)
    .leftJoin(media, eq(courses.thumbnailMediaId, media.id))
    .all();
}

export async function getCourseById(id: string) {
  return db
    .select(courseSelection)
    .from(courses)
    .leftJoin(media, eq(courses.thumbnailMediaId, media.id))
    .where(eq(courses.id, id))
    .get();
}
