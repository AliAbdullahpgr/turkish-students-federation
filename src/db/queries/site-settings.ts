import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { homeMessaging, siteIdentity } from "@/data/siteContent";

export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const result = await db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, key)).get();
    return result?.value ?? null;
  } catch {
    const fallbacks: Record<string, string> = {
      site_name: siteIdentity.name,
      site_short_name: siteIdentity.shortName,
      join_href: siteIdentity.joinHref,
      site_description: siteIdentity.description,
      home_eyebrow: homeMessaging.eyebrow,
      home_title_top: homeMessaging.titleTop,
      home_title_bottom: homeMessaging.titleBottom,
      home_summary: homeMessaging.summary,
      home_primary_cta: homeMessaging.primaryCta,
      home_secondary_cta: homeMessaging.secondaryCta,
      home_about_intro: homeMessaging.aboutIntro,
    };
    return fallbacks[key] ?? null;
  }
}

export async function getAllSiteSettings(): Promise<Record<string, string>> {
  let rows;
  try {
    rows = await db.select().from(siteSettings).all();
  } catch {
    return {
      site_name: siteIdentity.name,
      site_short_name: siteIdentity.shortName,
      join_href: siteIdentity.joinHref,
      site_description: siteIdentity.description,
      home_eyebrow: homeMessaging.eyebrow,
      home_title_top: homeMessaging.titleTop,
      home_title_bottom: homeMessaging.titleBottom,
      home_summary: homeMessaging.summary,
      home_primary_cta: homeMessaging.primaryCta,
      home_secondary_cta: homeMessaging.secondaryCta,
      home_about_intro: homeMessaging.aboutIntro,
    };
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
