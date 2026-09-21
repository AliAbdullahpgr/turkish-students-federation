import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { siteIdentity } from "@/data/siteContent";
import { staticFallbackOrThrow } from "@/db/queries/static-fallback";

const staticSettings: Record<string, string> = {
  site_name: siteIdentity.name,
  site_short_name: siteIdentity.shortName,
  guide_name: siteIdentity.guideName,
  guide_href: siteIdentity.guideHref,
  join_href: siteIdentity.joinHref,
  site_description: siteIdentity.description,
  guide_description: siteIdentity.guideDescription,
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

/**
 * `guideName` and `guideHref` read their own settings keys.
 *
 * They used to ignore them: `guideName` returned `site_name` and `guideHref`
 * was the literal `/news-blogs/?type=blog`. The settings endpoint has accepted
 * and stored `guide_name` and `guide_href` all along, so editing either field
 * in the admin panel saved successfully and then changed nothing on the site —
 * including the homepage hero button, which links to `guideHref`.
 *
 * Both still fall back the way they used to when the key has never been saved,
 * so an untouched install reads exactly as before.
 */
export async function getSiteIdentity() {
  const settings = await getAllSiteSettings();
  return {
    name: settings.site_name ?? "Pakistan Türk Öğrenci Birliği",
    shortName: settings.site_short_name ?? "PTÖB",
    guideName: settings.guide_name ?? settings.site_name ?? "Pakistan Türk Öğrenci Birliği",
    guideHref: settings.guide_href ?? "/news-blogs/?type=blog",
    joinHref: settings.join_href ?? "/join-tsf/",
    description: settings.site_description ?? "",
    guideDescription: settings.guide_description ?? "",
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
/** The association's featured video, until an editor picks another one. */
const DEFAULT_YOUTUBE_VIDEO = "https://www.youtube.com/watch?v=yr5MlusL0jE";

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
    videoUrl: settings.youtube_video_url ?? DEFAULT_YOUTUBE_VIDEO,
    channelUrl: settings.youtube_channel_url ?? "",
    ctaLabel: settings.youtube_cta_label ?? "Youtube Kanalını Takip Et",
    tags,
    visible: settings.youtube_visible !== "0",
  };
}
