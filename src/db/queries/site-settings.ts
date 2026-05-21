import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSiteSetting(key: string): Promise<string | null> {
  const result = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .get();
  return result?.value ?? null;
}

export async function getAllSiteSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(siteSettings).all();
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
    guideName: settings.guide_name ?? "Pakistan Öğrenci Rehberi",
    guideHref: settings.guide_href ?? "/pakistan-rehberi/",
    joinHref: settings.join_href ?? "/join-tsf/",
    description: settings.site_description ?? "",
    guideDescription: settings.guide_description ?? "",
  };
}

export async function getHomeMessaging() {
  const settings = await getAllSiteSettings();
  return {
    eyebrow: settings.home_eyebrow ?? "Pakistan Öğrenci Rehberi",
    titleTop: settings.home_title_top ?? "Pakistan'da",
    titleBottom: settings.home_title_bottom ?? "Öğrenci Hayatı",
    summary: settings.home_summary ?? "",
    primaryCta: settings.home_primary_cta ?? "Rehberi Aç",
    secondaryCta: settings.home_secondary_cta ?? "Bize Katıl",
    aboutIntro: settings.home_about_intro ?? "",
  };
}
