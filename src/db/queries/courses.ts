import { db } from "@/db/client";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllCourses() {
  return db.select().from(courses).all();
}

export async function getCourseById(id: string) {
  return db
    .select()
    .from(courses)
    .where(eq(courses.id, id))
    .get();
}
