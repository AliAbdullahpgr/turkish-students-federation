import { db } from "../src/db/client";
import { blogPosts, courses, events, media, teamMembers } from "../src/db/schema";
import { blogPosts as staticBlogPosts } from "../src/data/blogs";
import { courses as staticCourses } from "../src/data/courses";
import { events as staticEvents } from "../src/data/events";
import { guideBlogPosts } from "../src/data/guideBlogPosts";
import { teamMembers as staticTeamMembers } from "../src/data/team";
import { and, eq, isNull } from "drizzle-orm";

async function ensureStaticMedia(id: string, url: string, altText: string) {
  await db.insert(media).values({
    id,
    cloudinaryPublicId: `static:${id}`,
    url,
    secureUrl: url,
    resourceType: "image",
    altText,
  }).onConflictDoNothing({ target: media.id }).run();
  return id;
}

async function syncBlogPosts() {
  let inserted = 0;

  for (const post of staticBlogPosts) {
    const result = await db.insert(blogPosts).values({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      body: "",
      slug: post.slug,
      category: post.category ?? "Blog",
      author: post.author,
      publishedAt: post.dateISO,
    }).onConflictDoNothing({ target: blogPosts.slug }).run();
    inserted += result.rowsAffected;
    if (post.thumbnail) {
      const mediaId = await ensureStaticMedia(`static-blog-${post.id}`, post.thumbnail, post.title);
      await db.update(blogPosts)
        .set({ thumbnailMediaId: mediaId })
        .where(and(eq(blogPosts.slug, post.slug), isNull(blogPosts.thumbnailMediaId)))
        .run();
    }
  }

  for (const post of guideBlogPosts) {
    const result = await db.insert(blogPosts).values({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      slug: post.slug,
      category: post.category,
      author: post.author,
      publishedAt: post.publishedAt,
    }).onConflictDoNothing({ target: blogPosts.slug }).run();
    inserted += result.rowsAffected;
  }

  console.log(`Blog sync complete: ${inserted} missing rows inserted.`);
}

async function syncEvents() {
  let inserted = 0;
  for (const event of staticEvents) {
    const result = await db.insert(events).values({
      id: event.id,
      title: event.title,
      category: event.category,
      status: event.status,
      date: event.date ?? null,
      location: event.location ?? null,
    }).onConflictDoNothing({ target: events.id }).run();
    inserted += result.rowsAffected;
    if (event.posterImage) {
      const mediaId = await ensureStaticMedia(`static-event-${event.id}`, event.posterImage, event.title);
      await db.update(events)
        .set({ posterMediaId: mediaId })
        .where(and(eq(events.id, event.id), isNull(events.posterMediaId)))
        .run();
    }
  }
  console.log(`Event sync complete: ${inserted} missing rows inserted.`);
}

async function syncTeamMembers() {
  let inserted = 0;
  for (const member of staticTeamMembers) {
    const result = await db.insert(teamMembers).values({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      order: member.order,
      isActive: true,
    }).onConflictDoNothing({ target: teamMembers.id }).run();
    inserted += result.rowsAffected;
    if (member.photo) {
      const mediaId = await ensureStaticMedia(`static-team-${member.id}`, member.photo, member.name);
      await db.update(teamMembers)
        .set({ photoMediaId: mediaId })
        .where(and(eq(teamMembers.id, member.id), isNull(teamMembers.photoMediaId)))
        .run();
    }
  }
  console.log(`Team sync complete: ${inserted} missing rows inserted.`);
}

async function syncCourseMedia() {
  for (const course of staticCourses) {
    if (course.thumbnail) {
      const mediaId = await ensureStaticMedia(`static-course-${course.id}`, course.thumbnail, course.title);
      await db.update(courses)
        .set({ thumbnailMediaId: mediaId })
        .where(and(eq(courses.id, course.id), isNull(courses.thumbnailMediaId)))
        .run();
    }
  }
  console.log("Course media sync complete.");
}

Promise.all([
  syncBlogPosts(),
  syncEvents(),
  syncTeamMembers(),
  syncCourseMedia(),
]).catch((error) => {
  console.error("Static content sync failed:", error);
  process.exitCode = 1;
});
