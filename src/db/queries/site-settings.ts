import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { homeMessaging, siteIdentity } from "@/data/siteContent";
import { staticFallbackOrThrow } from "@/db/queries/static-fallback";

const staticSettings: Record<string, string> = {
  site_name: siteIdentity.name,
  site_short_name: siteIdentity.shortName,
  guide_name: siteIdentity.guideName,
  guide_href: siteIdentity.guideHref,
  join_href: siteIdentity.joinHref,
  site_description: siteIdentity.description,
  guide_description: siteIdentity.guideDescription,
  home_eyebrow: homeMessaging.eyebrow,
  home_title_top: homeMessaging.titleTop,
  home_title_bottom: homeMessaging.titleBottom,
  home_summary: homeMessaging.summary,
  home_primary_cta: homeMessaging.primaryCta,
  home_secondary_cta: homeMessaging.secondaryCta,
  home_about_intro: homeMessaging.aboutIntro,
};

export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const result = await db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, key)).get();
    return result?.value ?? null;
  } catch (error) {
    return staticFallbackOrThrow(error, staticSettings[key] ?? null);
  }
}

export async function getAllSiteSettings(): Promise<Record<string, string>> {
  let rows;
  try {
    rows = await db.select().from(siteSettings).all();
  } catch (error) {
    return staticFallbackOrThrow(error, staticSettings);
  }
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function getSiteIdentity() {
  const settings = await getAllSiteSettings();
  return {
    name: settings.site_name ?? "Pakistan Türk Öğrenci Birliği",
    shortName: settings.site_short_name ?? "PTÖB",
    guideName: settings.site_name ?? "Pakistan Türk Öğrenci Birliği",
    guideHref: "/news-blogs/?type=blog",
    joinHref: settings.join_href ?? "/join-tsf/",
    description: settings.site_description ?? "",
    guideDescription: settings.guide_description ?? "",
  };
}

export async function getHomeMessaging() {
  const settings = await getAllSiteSettings();
  return {
    eyebrow: settings.home_eyebrow ?? "Pakistan Türk Öğrenci Birliği",
    titleTop: settings.home_title_top ?? "Pakistan'da",
    titleBottom: settings.home_title_bottom ?? "Öğrenci Hayatı",
    summary: settings.home_summary ?? "",
    primaryCta: settings.home_primary_cta ?? "Blogları Keşfet",
    secondaryCta: settings.home_secondary_cta ?? "Bize Katıl",
    aboutIntro: settings.home_about_intro ?? "",
  };
}

/**
 * The copy that was previously hardcoded in `PresidentSection.tsx`. Kept as
 * the default so the homepage reads the same before anyone opens the new
 * admin page — moving the field into the database must not blank the site.
 */
const defaultPresidentBio =
  "Ömer Abbas, 3 Şubat 1999 doğumlu olup 1 Aralık 2025'ten bu yana Pakistan Türk " +
  "Öğrenci Birliği Başkanlığı görevini yürütmektedir. Afet Yönetimi alanında yüksek " +
  "lisans öğrencisi olan Ömer Abbas, öğrenci liderliği, toplum hizmetleri ve gençlik " +
  "çalışmalarında aktif rol almaktadır.";

/**
 * The homepage president card.
 *
 * These fields were literals inside `PresidentSection.tsx`, which is why the
 * panel offered no way to change the president — there was nothing to change.
 * They are plain settings keys rather than a table because there is exactly
 * one president at a time.
 */
export async function getPresidentSection() {
  const settings = await getAllSiteSettings();
  return {
    eyebrow: settings.president_eyebrow ?? "BAŞKAN",
    name: settings.president_name ?? "Ömer Abbas",
    role: settings.president_role ?? "Pakistan Türk Öğrenci Birliği Başkanı",
    bio: settings.president_bio ?? defaultPresidentBio,
    imageUrl: settings.president_image_url ?? "/image/leader.png",
    imageAlt: settings.president_image_alt ?? "Pakistan Türk Öğrenci Birliği Başkanı",
    /** Lets an editor take the whole section off the homepage without deleting the copy. */
    visible: settings.president_visible !== "0",
  };
}

/**
 * The homepage YouTube block: channel button plus one featured video.
 *
 * `video` holds whatever address the editor pasted; the embed and thumbnail
 * are derived from it at render time by `src/lib/youtube.ts`.
 */
export async function getYoutubeSection() {
  const settings = await getAllSiteSettings();
  const tags = (settings.youtube_tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    eyebrow: settings.youtube_eyebrow ?? "SON YAYIN",
    title: settings.youtube_title ?? "",
    description: settings.youtube_description ?? "",
    videoUrl: settings.youtube_video_url ?? "",
    channelUrl: settings.youtube_channel_url ?? "",
    ctaLabel: settings.youtube_cta_label ?? "Youtube Kanalını Takip Et",
    tags,
    visible: settings.youtube_visible !== "0",
  };
}
