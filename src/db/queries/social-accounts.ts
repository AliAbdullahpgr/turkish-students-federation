import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import { socialAccounts } from "@/db/schema";
import { staticFallbackOrThrow } from "@/db/queries/static-fallback";

export type SocialAccount = {
  id: string;
  platform: string;
  label: string;
  url: string;
  active: boolean;
  openInNewTab: boolean;
};

/**
 * Seeds the editor before anything has been saved. These mirror the values the
 * footer used to hardcode. Instagram now carries the association's real
 * account; YouTube is still listed with an empty url, so it shows up in the
 * admin as "needs a link" rather than silently rendering a dead icon.
 */
export const defaultSocialAccounts: SocialAccount[] = [
  {
    id: "",
    platform: "facebook",
    label: "Facebook",
    url: "https://facebook.com/tsfturkey",
    active: true,
    openInNewTab: true,
  },
  {
    id: "",
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/pakturkogrencibirligi/",
    active: true,
    openInNewTab: true,
  },
  { id: "", platform: "youtube", label: "YouTube", url: "", active: true, openInNewTab: true },
];

function toSocialAccount(row: typeof socialAccounts.$inferSelect): SocialAccount {
  return {
    id: row.id,
    platform: row.platform,
    label: row.label,
    url: row.url,
    active: row.active,
    openInNewTab: row.openInNewTab,
  };
}

/** Every account, including inactive and link-less ones — for the admin editor. */
export async function getAllSocialAccounts(): Promise<SocialAccount[]> {
  try {
    const rows = await db
      .select()
      .from(socialAccounts)
      .orderBy(asc(socialAccounts.sortOrder))
      .all();
    return rows.length ? rows.map(toSocialAccount) : defaultSocialAccounts;
  } catch (error) {
    return staticFallbackOrThrow(error, defaultSocialAccounts);
  }
}

/**
 * What the public site renders. An account with no link is dropped rather than
 * shown as a dead `#` — that dead link is exactly the bug this table replaced.
 */
export async function getVisibleSocialAccounts(): Promise<SocialAccount[]> {
  const accounts = await getAllSocialAccounts();
  return accounts.filter((account) => account.active && account.url.trim().length > 0);
}
