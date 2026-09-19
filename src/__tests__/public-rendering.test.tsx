import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  setupSchema,
  resetTables,
  closeHarness,
  jsonRequest,
  seedMedia,
} from "./helpers/admin-harness";

/*
  The last link in the chain.

  The other suites prove an admin write reaches the public *query*. These prove
  the public *view* actually displays it: each section is rendered with exactly
  the props `src/app/page.tsx` passes it, built from exactly the queries that
  page calls. If a field is written, read back, and then never rendered, this is
  where that shows up.

  The page components themselves are async server components composing other
  async server components, which needs an RSC runtime vitest does not have — so
  the page's data flow is reproduced here and the leaf sections are rendered
  directly.
*/

type Handler = (req: Request, ctx?: unknown) => Promise<Response>;

let blogRoutes: { POST: Handler };
let eventRoutes: { POST: Handler };
let activityRoutes: { POST: Handler };
let activityPostRoutes: { POST: Handler };
let courseRoutes: { POST: Handler };
let settingsRoutes: { PUT: Handler };
let actions: typeof import("@/app/admin/actions");

let siteSettings: typeof import("@/db/queries/site-settings");
let blogQueries: typeof import("@/db/queries/blog-posts");
let eventQueries: typeof import("@/db/queries/events");
let activityQueries: typeof import("@/db/queries/activities");
let activityPostQueries: typeof import("@/db/queries/activity-posts");
let courseQueries: typeof import("@/db/queries/courses");
let youtubeLib: typeof import("@/lib/youtube");

beforeAll(async () => {
  await setupSchema();
  blogRoutes = (await import("@/app/api/admin/blog-posts/route")) as unknown as typeof blogRoutes;
  eventRoutes = (await import("@/app/api/admin/events/route")) as unknown as typeof eventRoutes;
  activityRoutes = (await import("@/app/api/admin/activities/route")) as unknown as typeof activityRoutes;
  activityPostRoutes = (await import("@/app/api/admin/activity-posts/route")) as unknown as typeof activityPostRoutes;
  courseRoutes = (await import("@/app/api/admin/courses/route")) as unknown as typeof courseRoutes;
  settingsRoutes = (await import("@/app/api/admin/site-settings/route")) as unknown as typeof settingsRoutes;
  actions = await import("@/app/admin/actions");

  siteSettings = await import("@/db/queries/site-settings");
  blogQueries = await import("@/db/queries/blog-posts");
  eventQueries = await import("@/db/queries/events");
  activityQueries = await import("@/db/queries/activities");
  activityPostQueries = await import("@/db/queries/activity-posts");
  courseQueries = await import("@/db/queries/courses");
  youtubeLib = await import("@/lib/youtube");
});

afterAll(closeHarness);
beforeEach(resetTables);

/** Rendered HTML with entities decoded, so assertions can use plain Turkish text. */
function render(component: unknown, props: Record<string, unknown>) {
  const html = renderToStaticMarkup(
    createElement(component as ComponentType<Record<string, unknown>>, props),
  );
  return html
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

async function runAction(action: (form: FormData) => Promise<void>, fields: Record<string, string>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  try {
    await action(form);
  } catch (error) {
    const digest = (error as { digest?: string }).digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) return digest.split(";")[2];
    throw error;
  }
  throw new Error("action did not redirect");
}

describe("homepage sections render what the admin wrote", () => {
  it("HeroSection shows the saved messaging and links to the saved guide href", async () => {
    await settingsRoutes.PUT(
      jsonRequest("PUT", {
        site_name: "Pakistan Türk Öğrenci Birliği",
        home_eyebrow: "ÖĞRENCİ BİRLİĞİ",
        home_title_top: "Pakistanda",
        home_title_bottom: "Birlikte Öğrenmek",
        home_summary: "Kısa tanıtım metni burada.",
        home_primary_cta: "Blogları Keşfet",
        home_secondary_cta: "Bize Katıl",
        guide_href: "/pakistan-rehberi/",
        join_href: "/join-tsf/",
      }),
    );

    const { default: HeroSection } = await import("@/components/sections/home/HeroSection");
    const html = render(HeroSection, {
      messaging: await siteSettings.getHomeMessaging(),
      identity: await siteSettings.getSiteIdentity(),
    });

    expect(html).toContain("Pakistanda");
    expect(html).toContain("Birlikte Öğrenmek");
    expect(html).toContain("Kısa tanıtım metni burada.");
    expect(html).toContain("Blogları Keşfet");
    // The guide button honours the saved href rather than the old hardcoded one.
    expect(html).toContain("/pakistan-rehberi");
    expect(html).not.toContain("/news-blogs/?type=blog");
  });

  it("WhoWeAreSection shows the saved about intro", async () => {
    await settingsRoutes.PUT(
      jsonRequest("PUT", {
        home_about_intro: "Birliğimiz 2015 yılından beri faaliyet göstermektedir.",
        site_name: "Pakistan Türk Öğrenci Birliği",
      }),
    );

    const { default: WhoWeAreSection } = await import("@/components/sections/about/WhoWeAreSection");
    const html = render(WhoWeAreSection, {
      messaging: await siteSettings.getHomeMessaging(),
      identity: await siteSettings.getSiteIdentity(),
    });

    expect(html).toContain("Birliğimiz 2015 yılından beri faaliyet göstermektedir.");
  });

  it("PresidentSection renders the saved president and photo", async () => {
    await runAction(actions.savePresidentSection, {
      name: "Ömer Abbas",
      role: "PTÖB Başkanı",
      bio: "Afet Yönetimi yüksek lisans öğrencisi.",
      imageUrl: "/image/leader.png",
      imageAlt: "PTÖB Başkanı portresi",
      visible: "on",
    });

    const president = await siteSettings.getPresidentSection();
    expect(president.visible).toBe(true);

    const { default: PresidentSection } = await import("@/components/sections/home/PresidentSection");
    const html = render(PresidentSection, {
      name: president.name,
      role: president.role,
      bio: president.bio,
      imageUrl: president.imageUrl,
      imageAlt: president.imageAlt,
    });

    expect(html).toContain("Ömer Abbas");
    expect(html).toContain("PTÖB Başkanı");
    expect(html).toContain("Afet Yönetimi yüksek lisans öğrencisi.");
    expect(html).toContain("leader.png");
  });

  it("ActivitiesSection renders every saved activity", async () => {
    await activityRoutes.POST(
      jsonRequest("POST", { title: "Seminerler", description: "Akademik seminerler.", icon: "presentation", sortOrder: 1 }),
    );
    await activityRoutes.POST(
      jsonRequest("POST", { title: "Multimedya Etkinlikleri", description: "Video çalışmaları.", icon: "video", sortOrder: 2 }),
    );

    const { default: ActivitiesSection } = await import("@/components/sections/home/ActivitiesSection");
    const html = render(ActivitiesSection, { activities: await activityQueries.getAllActivities() });

    expect(html).toContain("Seminerler");
    expect(html).toContain("Akademik seminerler.");
    expect(html).toContain("Multimedya Etkinlikleri");
    expect(html).toContain("Video çalışmaları.");
  });

  it("ActivityPostsSection renders a published activity with its image", async () => {
    const media = await seedMedia("faaliyet");
    await activityPostRoutes.POST(
      jsonRequest("POST", {
        title: "Yetimhane Ziyareti",
        excerpt: "Lahordaki yetimhaneyi ziyaret ettik.",
        location: "Lahor",
        happenedAt: "2026-06-15",
        isPublished: true,
        thumbnailMediaId: media.id,
      }),
    );

    const { default: ActivityPostsSection } = await import("@/components/sections/home/ActivityPostsSection");
    const html = render(ActivityPostsSection, {
      activities: await activityPostQueries.getPublishedActivityPosts(3),
    });

    expect(html).toContain("Yetimhane Ziyareti");
    expect(html).toContain("Lahordaki yetimhaneyi ziyaret ettik.");
    expect(html).toContain("yetimhane-ziyareti");
  });

  it("ActivityPostsSection renders nothing at all when no activity is published", async () => {
    const { default: ActivityPostsSection } = await import("@/components/sections/home/ActivityPostsSection");
    const html = render(ActivityPostsSection, {
      activities: await activityPostQueries.getPublishedActivityPosts(3),
    });
    expect(html).toBe("");
  });

  it("MediaNewsSection renders the latest blog posts", async () => {
    await blogRoutes.POST(
      jsonRequest("POST", {
        title: "Karaçi Rehberi",
        excerpt: "Şehre yeni gelenler için notlar.",
        publishedAt: "2026-04-10",
      }),
    );

    const { default: MediaNewsSection } = await import("@/components/sections/home/MediaNewsSection");
    const html = render(MediaNewsSection, { posts: await blogQueries.getLatestBlogPosts(6) });

    expect(html).toContain("Karaçi Rehberi");
    expect(html).toContain("karaci-rehberi");
  });

  it("EventsPreviewSection renders saved events", async () => {
    await eventRoutes.POST(
      jsonRequest("POST", {
        title: "PTÖB Yıllık Buluşması",
        status: "upcoming",
        date: "2026-11-20",
        location: "İslamabad",
        category: "Buluşma",
      }),
    );

    const { default: EventsPreviewSection } = await import("@/components/sections/home/EventsPreviewSection");
    const html = render(EventsPreviewSection, {
      events: [...(await eventQueries.getUpcomingEvents()), ...(await eventQueries.getRecentEvents())],
    });

    expect(html).toContain("PTÖB Yıllık Buluşması");
    expect(html).toContain("Buluşma");
    expect(html).toContain("2026-11-20");
    // The homepage preview card deliberately omits the location; the /events
    // page below is where it surfaces.
  });

  it("the /events page renders the saved location that the homepage preview omits", async () => {
    await eventRoutes.POST(
      jsonRequest("POST", {
        title: "PTÖB Yıllık Buluşması",
        status: "upcoming",
        date: "2026-11-20",
        location: "İslamabad",
        category: "Buluşma",
      }),
    );

    const { default: EventsPageClient } = await import("@/app/events/EventsPageClient");
    const html = render(EventsPageClient, { events: await eventQueries.getAllEvents() });

    expect(html).toContain("PTÖB Yıllık Buluşması");
    expect(html).toContain("İslamabad");
  });

  it("LatestReleaseSection renders the saved YouTube block as a nocookie embed", async () => {
    await runAction(actions.saveYoutubeSection, {
      title: "Tanıtım Videosu",
      description: "Birliğin tanıtım videosu.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channelUrl: "https://www.youtube.com/@ptob",
      ctaLabel: "Kanalı Takip Et",
      tags: "tanıtım, öğrenci",
      visible: "on",
    });

    const youtube = await siteSettings.getYoutubeSection();
    const { default: LatestReleaseSection } = await import("@/components/sections/home/LatestReleaseSection");
    const html = render(LatestReleaseSection, {
      title: youtube.title,
      description: youtube.description,
      tags: youtube.tags,
      embedUrl: youtubeLib.youtubeEmbedUrl(youtube.videoUrl),
      channelUrl: youtube.channelUrl,
      ctaLabel: youtube.ctaLabel,
    });

    expect(html).toContain("Tanıtım Videosu");
    expect(html).toContain("Birliğin tanıtım videosu.");
    expect(html).toContain("Kanalı Takip Et");
    expect(html).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(html).toContain("tanıtım");
  });
});

describe("public list pages render what the admin wrote", () => {
  it("the news-blogs list renders a created post with its thumbnail and link", async () => {
    const media = await seedMedia("kapak");
    await blogRoutes.POST(
      jsonRequest("POST", {
        title: "Lahorda Öğrenci Olmak",
        excerpt: "Şehre yeni gelenler için notlar.",
        author: "Ömer Abbas",
        category: "Rehber",
        publishedAt: "2026-03-01",
        thumbnailMediaId: media.id,
      }),
    );

    const posts = (await blogQueries.getAllBlogPosts()).filter(
      (post) => post.category?.toLocaleLowerCase("tr") !== "news",
    );

    const { default: NewsBlogsPageClient } = await import("@/app/news-blogs/NewsBlogsPageClient");
    const html = render(NewsBlogsPageClient, { posts, searchQuery: "", filterMonth: "", type: "blog" });

    expect(html).toContain("Lahorda Öğrenci Olmak");
    expect(html).toContain("Şehre yeni gelenler için notlar.");
    expect(html).toContain("lahorda-ogrenci-olmak");
    expect(html).toContain(media.secureUrl.split("/").pop()!.replace(".jpg", ""));
  });

  it("a post filed under News is kept off the blog tab", async () => {
    await blogRoutes.POST(
      jsonRequest("POST", { title: "Basın Açıklaması", excerpt: "x", category: "News" }),
    );

    const all = await blogQueries.getAllBlogPosts();
    const blogTab = all.filter((post) => post.category?.toLocaleLowerCase("tr") !== "news");
    const newsTab = all.filter((post) => post.category?.toLocaleLowerCase("tr") === "news");

    expect(blogTab).toHaveLength(0);
    expect(newsTab).toHaveLength(1);

    const { default: NewsBlogsPageClient } = await import("@/app/news-blogs/NewsBlogsPageClient");
    expect(render(NewsBlogsPageClient, { posts: blogTab, searchQuery: "", filterMonth: "", type: "blog" })).not.toContain(
      "Basın Açıklaması",
    );
    expect(render(NewsBlogsPageClient, { posts: newsTab, searchQuery: "", filterMonth: "", type: "news" })).toContain(
      "Basın Açıklaması",
    );
  });

  it("an edited title replaces the old one in the rendered list", async () => {
    const created = await (
      await blogRoutes.POST(jsonRequest("POST", { title: "Eski Başlık", excerpt: "x" }))
    ).json();

    const idRoutes = (await import("@/app/api/admin/blog-posts/[id]/route")) as unknown as {
      PUT: Handler;
    };
    await idRoutes.PUT(
      jsonRequest("PUT", { title: "Yeni Başlık", excerpt: "x" }),
      { params: Promise.resolve({ id: created.id }) },
    );

    const { default: NewsBlogsPageClient } = await import("@/app/news-blogs/NewsBlogsPageClient");
    const html = render(NewsBlogsPageClient, {
      posts: await blogQueries.getAllBlogPosts(),
      searchQuery: "",
      filterMonth: "",
      type: "blog",
    });

    expect(html).toContain("Yeni Başlık");
    expect(html).not.toContain("Eski Başlık");
  });

  it("a deleted post is gone from the rendered list", async () => {
    const created = await (
      await blogRoutes.POST(jsonRequest("POST", { title: "Silinecek Yazı", excerpt: "x" }))
    ).json();

    const idRoutes = (await import("@/app/api/admin/blog-posts/[id]/route")) as unknown as {
      DELETE: Handler;
    };
    await idRoutes.DELETE(jsonRequest("DELETE"), { params: Promise.resolve({ id: created.id }) });

    const { default: NewsBlogsPageClient } = await import("@/app/news-blogs/NewsBlogsPageClient");
    const html = render(NewsBlogsPageClient, {
      posts: await blogQueries.getAllBlogPosts(),
      searchQuery: "",
      filterMonth: "",
      type: "blog",
    });

    expect(html).not.toContain("Silinecek Yazı");
  });

  it("CoursesCarouselSection renders a saved course", async () => {
    await courseRoutes.POST(
      jsonRequest("POST", {
        title: "Urduca Başlangıç Kursu",
        instructor: "Dr. Kamran",
        description: "Sıfırdan Urduca.",
        href: "/literature/",
      }),
    );

    const { default: CoursesCarouselSection } = await import(
      "@/components/sections/home/CoursesCarouselSection"
    );
    const html = render(CoursesCarouselSection, { courses: await courseQueries.getAllCourses() });

    expect(html).toContain("Urduca Başlangıç Kursu");
  });
});
