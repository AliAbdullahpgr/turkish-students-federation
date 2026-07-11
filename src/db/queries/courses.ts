import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { courses, media } from "@/db/schema";
import { courses as fallbackCourses } from "@/data/courses";

const courseFallbacks = fallbackCourses.map((course) => ({
  ...course,
  instructor: course.instructor || null,
  description: course.description || null,
  thumbnail: course.thumbnail || null,
  thumbnailMediaId: null,
  createdAt: null,
}));

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
  try { return await db
    .select(courseSelection)
    .from(courses)
    .leftJoin(media, eq(courses.thumbnailMediaId, media.id))
    .all(); } catch { return courseFallbacks; }
}

export async function getCourseById(id: string) {
  return db
    .select(courseSelection)
    .from(courses)
    .leftJoin(media, eq(courses.thumbnailMediaId, media.id))
    .where(eq(courses.id, id))
    .get();
}
