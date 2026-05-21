import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { siteSettings } from "@/db/schema/site-settings";
import { blogPosts } from "@/db/schema/blog-posts";
import { events } from "@/db/schema/events";
import { teamMembers } from "@/db/schema/team-members";
import { courses } from "@/db/schema/courses";
import { activities } from "@/db/schema/activities";
import { guideSections } from "@/db/schema/guide-sections";
import { navigationItems } from "@/db/schema/navigation-items";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
const db = drizzle(turso);
import { sql } from "drizzle-orm";

// Import static data
import { siteIdentity, homeMessaging } from "@/data/siteContent";
import { blogPosts as staticBlogPosts } from "@/data/blogs";
import { events as staticEvents } from "@/data/events";
import { teamMembers as staticTeam } from "@/data/team";
import { courses as staticCourses } from "@/data/courses";
import { activities as staticActivities } from "@/data/activities";
import { pakistanGuideData } from "@/data/pakistanGuide";
import { navItems } from "@/data/navigation";

async function seedSiteSettings() {
  const settings = [
    { key: "site_name", value: siteIdentity.name },
    { key: "site_short_name", value: siteIdentity.shortName },
    { key: "guide_name", value: siteIdentity.guideName },
    { key: "guide_href", value: siteIdentity.guideHref },
    { key: "join_href", value: siteIdentity.joinHref },
    { key: "site_description", value: siteIdentity.description },
    { key: "guide_description", value: siteIdentity.guideDescription },
    { key: "home_eyebrow", value: homeMessaging.eyebrow },
    { key: "home_title_top", value: homeMessaging.titleTop },
    { key: "home_title_bottom", value: homeMessaging.titleBottom },
    { key: "home_summary", value: homeMessaging.summary },
    { key: "home_primary_cta", value: homeMessaging.primaryCta },
    { key: "home_secondary_cta", value: homeMessaging.secondaryCta },
    { key: "home_about_intro", value: homeMessaging.aboutIntro },
  ];

  for (const { key, value } of settings) {
    await db.insert(siteSettings).values({ key, value });
  }

  console.log(`  ✅ site_settings: ${settings.length} records`);
}

async function seedBlogPosts() {
  for (const post of staticBlogPosts) {
    await db.insert(blogPosts).values({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      category: post.category ?? "Blog",
      author: post.author,
      publishedAt: post.dateISO,
    });
  }
  console.log(`  ✅ blog_posts: ${staticBlogPosts.length} records`);
}

async function seedEvents() {
  for (const event of staticEvents) {
    await db.insert(events).values({
      id: event.id,
      title: event.title,
      category: event.category,
      status: event.status,
      date: event.date ?? null,
      location: event.location ?? null,
    });
  }
  console.log(`  ✅ events: ${staticEvents.length} records`);
}

async function seedTeamMembers() {
  for (const member of staticTeam) {
    await db.insert(teamMembers).values({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      order: member.order,
    });
  }
  console.log(`  ✅ team_members: ${staticTeam.length} records`);
}

async function seedCourses() {
  for (const course of staticCourses) {
    await db.insert(courses).values({
      id: course.id,
      title: course.title,
      instructor: course.instructor,
      description: course.description,
      href: course.href,
    });
  }
  console.log(`  ✅ courses: ${staticCourses.length} records`);
}

async function seedActivities() {
  for (let i = 0; i < staticActivities.length; i++) {
    const activity = staticActivities[i];
    await db.insert(activities).values({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      icon: activity.icon,
      sortOrder: i,
    });
  }
  console.log(`  ✅ activities: ${staticActivities.length} records`);
}

async function seedGuideSectionsRecursive(
  sections: typeof pakistanGuideData,
  parentId: string | null = null,
  sortOrder = 0
): Promise<number> {
  let order = sortOrder;
  for (const section of sections) {
    await db.insert(guideSections)
      .values({
        id: section.id,
        parentId,
        title: section.title,
        content: section.content ?? "",
        level: section.level,
        sortOrder: order++,
        isPublished: true,
      });

    if (section.children && section.children.length > 0) {
      order = await seedGuideSectionsRecursive(section.children, section.id, order);
    }
  }
  return order;
}

async function seedGuideSections() {
  await seedGuideSectionsRecursive(pakistanGuideData);

  // Count total inserted
  let count = 0;
  function countSections(sections: typeof pakistanGuideData): number {
    let c = sections.length;
    for (const s of sections) {
      if (s.children) c += countSections(s.children);
    }
    return c;
  }
  count = countSections(pakistanGuideData);
  console.log(`  ✅ guide_sections: ${count} records`);
}

async function seedNavigationRecursive(
  items: typeof navItems,
  parentId: string | null = null,
  sortStart = 0
): Promise<number> {
  let order = sortStart;

  for (const item of items) {
    const navId = item.label
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const thisId = `${navId}-${order}`;

    await db.insert(navigationItems)
      .values({
        id: thisId,
        parentId,
        label: item.label,
        href: item.href,
        sortOrder: order++,
        isVisible: true,
      });

    if (item.children && item.children.length > 0) {
      const children = item.children.map((child) => ({
        label: child.label,
        href: child.href,
      }));

      for (const child of children) {
        const childId = child.label
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

        await db.insert(navigationItems)
          .values({
            id: `${childId}-${order}`,
            parentId: thisId,
            label: child.label,
            href: child.href,
            sortOrder: order++,
            isVisible: true,
          });
      }
    }
  }

  return order;
}

async function seedNavigation() {
  await seedNavigationRecursive(navItems);

  let count = navItems.length;
  for (const item of navItems) {
    if (item.children) count += item.children.length;
  }
  console.log(`  ✅ navigation_items: ${count} records`);
}

async function main() {
  console.log("🌱 Seeding database...\n");

  // Use raw SQL for clearing to avoid FK constraint issues
  await db.run(sql`DELETE FROM navigation_items`);
  await db.run(sql`DELETE FROM guide_sections`);
  await db.run(sql`DELETE FROM activities`);
  await db.run(sql`DELETE FROM courses`);
  await db.run(sql`DELETE FROM team_members`);
  await db.run(sql`DELETE FROM events`);
  await db.run(sql`DELETE FROM blog_posts`);
  await db.run(sql`DELETE FROM site_settings`);

  await seedSiteSettings();
  await seedBlogPosts();
  await seedEvents();
  await seedTeamMembers();
  await seedCourses();
  await seedActivities();
  await seedGuideSections();
  await seedNavigation();

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
