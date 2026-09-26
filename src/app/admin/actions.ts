"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { siteSettings, socialAccounts } from "@/db/schema";
import { HOME_FIELDS, homeFieldMaxLength } from "@/db/queries/home-sections";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateSiteContent } from "@/lib/content-revalidation";
import { isValidLinkTarget } from "@/lib/public-routes";
import { extractYoutubeVideoId, normalizeYoutubeChannelUrl } from "@/lib/youtube";

/**
 * Server actions behind the settings-shaped admin screens.
 *
 * These pages post their form straight to an action rather than going through
 * `/api/admin/*` with client-side fetch, which is what the rest of the panel
 * still does. The round trip through an API route bought nothing here: the
 * form is server-rendered, the result is server-rendered, and the indirection
 * only added a second place to keep the field list in sync.
 *
 * Every action re-checks the session. The layout already gates these routes,
 * but a server action is its own POST endpoint and is reachable by id without
 * ever rendering the page it belongs to.
 */

const MAX_SHORT = 500;
const MAX_LONG = 10_000;

function text(form: FormData, key: string, maxLength = MAX_SHORT) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function checkbox(form: FormData, key: string) {
  // An unchecked box submits nothing at all, which is the "0" case.
  return form.get(key) === "on" || form.get(key) === "1" ? "1" : "0";
}

async function writeSettings(values: Record<string, string>) {
  for (const [key, value] of Object.entries(values)) {
    const existing = await db
      .select({ key: siteSettings.key })
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .get();

    if (existing) {
      await db
        .update(siteSettings)
        .set({ value, updatedAt: new Date().toISOString() })
        .where(eq(siteSettings.key, key))
        .run();
    } else {
      await db.insert(siteSettings).values({ key, value }).run();
    }
  }
}

/**
 * The whole homepage in one save.
 *
 * Fields are driven off `HOME_SECTIONS` rather than a list kept here, so a new
 * homepage field cannot be added to the form and then silently dropped on the
 * write — which is exactly how `guide_name` and `guide_href` used to behave in
 * the settings endpoint.
 */
export async function saveHomeContent(form: FormData) {
  await requireAdmin();

  const values: Record<string, string> = {};

  for (const field of HOME_FIELDS) {
    if (field.kind === "toggle") {
      values[field.key] = checkbox(form, field.key);
      continue;
    }

    const value = text(form, field.key, homeFieldMaxLength(field));

    // A blank link is allowed — it means "no button". A non-blank one has to be
    // a real target, so a typo cannot put a dead link on the homepage. Image
    // paths go through the same check: `/image/…` or an https address.
    if ((field.kind === "href" || field.kind === "image") && value && !isValidLinkTarget(value)) {
      redirect(`/admin/home?error=href&field=${encodeURIComponent(field.key)}`);
    }

    values[field.key] = value;
  }

  await writeSettings(values);

  revalidateSiteContent();
  redirect("/admin/home?saved=1");
}

export async function savePresidentSection(form: FormData) {
  await requireAdmin();

  const name = text(form, "name");
  const role = text(form, "role");
  if (!name || !role) redirect("/admin/president?error=required");

  const imageUrl = text(form, "imageUrl", 1_000);
  // Accepts an uploaded/site-relative path or an absolute https image address.
  if (imageUrl && !isValidLinkTarget(imageUrl)) {
    redirect("/admin/president?error=image");
  }

  await writeSettings({
    president_eyebrow: text(form, "eyebrow"),
    president_name: name,
    president_role: role,
    president_bio: text(form, "bio", MAX_LONG),
    president_image_url: imageUrl,
    president_image_alt: text(form, "imageAlt"),
    president_visible: checkbox(form, "visible"),
  });

  revalidateSiteContent();
  redirect("/admin/president?saved=1");
}

export async function saveYoutubeSection(form: FormData) {
  await requireAdmin();

  const rawVideo = text(form, "videoUrl", 1_000);
  const rawChannel = text(form, "channelUrl", 1_000);

  // Both are validated before the write so a typo cannot land a dead embed on
  // the homepage — the admin gets the field back with a reason instead.
  if (rawVideo && !extractYoutubeVideoId(rawVideo)) {
    redirect("/admin/youtube?error=video");
  }
  if (rawChannel && !normalizeYoutubeChannelUrl(rawChannel)) {
    redirect("/admin/youtube?error=channel");
  }

  await writeSettings({
    youtube_eyebrow: text(form, "eyebrow"),
    youtube_title: text(form, "title"),
    youtube_description: text(form, "description", MAX_LONG),
    youtube_video_url: rawVideo,
    youtube_channel_url: rawChannel ? (normalizeYoutubeChannelUrl(rawChannel) ?? "") : "",
    youtube_cta_label: text(form, "ctaLabel"),
    youtube_tags: text(form, "tags", 1_000),
    youtube_visible: checkbox(form, "visible"),
  });

  revalidateSiteContent();
  redirect("/admin/youtube?saved=1");
}

type SocialAccountInput = {
  id: string;
  platform: string;
  label: string;
  url: string;
  active: boolean;
  openInNewTab: boolean;
};

/**
 * The editor posts the whole list as one JSON field, so the saved order is the
 * order on screen. The table is rewritten rather than diffed: the list is a
 * handful of rows, and a rewrite cannot leave a removed row behind.
 */
export async function saveSocialAccounts(form: FormData) {
  await requireAdmin();

  let parsed: unknown;
  try {
    parsed = JSON.parse(String(form.get("accounts") ?? "[]"));
  } catch {
    redirect("/admin/social?error=payload");
  }
  if (!Array.isArray(parsed)) redirect("/admin/social?error=payload");

  const accounts: SocialAccountInput[] = [];
  for (const entry of parsed as Record<string, unknown>[]) {
    const platform = String(entry.platform ?? "").trim().toLowerCase().slice(0, 40);
    const url = String(entry.url ?? "").trim().slice(0, 1_000);
    // A row with neither a platform nor a link is an empty row the editor
    // added and never filled in; dropping it is friendlier than an error.
    if (!platform && !url) continue;
    if (!platform) redirect("/admin/social?error=platform");
    if (url && !isValidLinkTarget(url)) redirect("/admin/social?error=url");

    accounts.push({
      id: String(entry.id ?? "").trim() || nanoid(),
      platform,
      label: String(entry.label ?? "").trim().slice(0, 120),
      url,
      active: entry.active !== false,
      openInNewTab: entry.openInNewTab !== false,
    });
  }

  await db.delete(socialAccounts).run();
  if (accounts.length) {
    await db
      .insert(socialAccounts)
      .values(
        accounts.map((account, index) => ({
          id: account.id,
          platform: account.platform,
          label: account.label,
          url: account.url,
          active: account.active,
          openInNewTab: account.openInNewTab,
          sortOrder: index,
          updatedAt: new Date().toISOString(),
        })),
      )
      .run();
  }

  revalidateSiteContent();
  redirect("/admin/social?saved=1");
}
