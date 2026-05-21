import { relations } from "drizzle-orm";

import { media } from "./media";
import { siteSettings } from "./site-settings";
import { blogPosts } from "./blog-posts";
import { events } from "./events";
import { teamMembers } from "./team-members";
import { courses } from "./courses";
import { activities } from "./activities";
import { guideSections } from "./guide-sections";
import { navigationItems } from "./navigation-items";

export { media, siteSettings, blogPosts, events, teamMembers, courses, activities, guideSections, navigationItems };

export const mediaRelations = relations(media, ({ many }) => ({
  blogPosts: many(blogPosts),
  events: many(events),
  teamMembers: many(teamMembers),
  courses: many(courses),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  thumbnailMedia: one(media, {
    fields: [blogPosts.thumbnailMediaId],
    references: [media.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  posterMedia: one(media, {
    fields: [events.posterMediaId],
    references: [media.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  photoMedia: one(media, {
    fields: [teamMembers.photoMediaId],
    references: [media.id],
  }),
}));

export const coursesRelations = relations(courses, ({ one }) => ({
  thumbnailMedia: one(media, {
    fields: [courses.thumbnailMediaId],
    references: [media.id],
  }),
}));

export const guideSectionsRelations = relations(guideSections, ({ one, many }) => ({
  parent: one(guideSections, {
    fields: [guideSections.parentId],
    references: [guideSections.id],
    relationName: "guideSectionHierarchy",
  }),
  children: many(guideSections, { relationName: "guideSectionHierarchy" }),
}));

export const navigationItemsRelations = relations(navigationItems, ({ one, many }) => ({
  parent: one(navigationItems, {
    fields: [navigationItems.parentId],
    references: [navigationItems.id],
    relationName: "navigationHierarchy",
  }),
  children: many(navigationItems, { relationName: "navigationHierarchy" }),
}));

export const schema = {
  media,
  siteSettings,
  blogPosts,
  events,
  teamMembers,
  courses,
  activities,
  guideSections,
  navigationItems,
};
