/**
 * Removes the demo content that was seeded into the live database.
 *
 * The original clone shipped invented articles, courses and events, all
 * illustrated with picsum.photos stock images, and `seed.ts` wrote them to the
 * real database. On the live site they read as things the association had
 * actually published. Deleting them from `src/data/` stops them shipping;
 * this removes the rows that are already there.
 *
 * It also fills in the things the association asked for and that only exist as
 * data: the featured YouTube video, the Instagram account, and the menu entry
 * that pointed "Haberler" at the blog filter.
 *
 * Targeting is by exact identity — the seeded slugs and ids, and media rows
 * whose url is literally a picsum.photos address. Anything written since is
 * untouched, and a row a real editor has repointed at their own image is kept.
 *
 *   npx tsx --env-file=.env scripts/remove-placeholder-content.ts          # dry run
 *   npx tsx --env-file=.env scripts/remove-placeholder-content.ts --apply  # write
 */

import { createClient, type Client } from "@libsql/client";

const APPLY = process.argv.includes("--apply");

/** Slugs of the six invented blog posts written by the original seed. */
const PLACEHOLDER_BLOG_SLUGS = [
  "rising-prices-burden-on-students",
  "tsf-hope-for-students",
  "teaching-quran",
  "ex-president-ans-muhsi",
  "umer-abbas-president",
  "farewell-ans-muhsi",
];

const PLACEHOLDER_COURSE_TITLES = [
  "İslami Konular",
  "Liderlik Temelleri",
  "Kuran Tefsiri",
  "Arapça Dili",
  "Toplum Hizmeti",
  "İslam Tarihi",
];

const PLACEHOLDER_EVENT_TITLES = [
  "İzci Kampı",
  "Bayramlaşma",
  "Gönüllü Çağrısı",
  "Gençlik Liderlik Zirvesi",
];

/** Settings the association supplied directly. */
const SETTINGS_TO_SET: Record<string, string> = {
  youtube_video_url: "https://www.youtube.com/watch?v=yr5MlusL0jE",
  youtube_visible: "1",
  // The hero button used to inherit the guide link, which is the blog listing.
  home_primary_cta: "Faaliyetlerimiz",
  home_hero_cta_href: "/faaliyetler/",
};

const INSTAGRAM_URL = "https://www.instagram.com/pakturkogrencibirligi/";

const PICSUM_MEDIA =
  "select id from media where url like '%picsum.photos%' or secure_url like '%picsum.photos%'";

/** A CTE naming the rows of `table` whose `column` points at a placeholder image. */
const USING_PICSUM = (table: string, column: string) =>
  `with t as (select * from ${table} where ${column} in (${PICSUM_MEDIA}))`;

function placeholders(values: string[]) {
  return values.map(() => "?").join(", ");
}

async function count(db: Client, sql: string, args: unknown[] = []) {
  const result = await db.execute({ sql, args: args as never[] });
  return Number(result.rows[0]?.n ?? 0);
}

/**
 * Prints the rows an operation is about to touch.
 *
 * The dry run counts alone were not enough: the first run reported 20
 * placeholder images but zero matching posts or events, which only makes
 * sense once you can see which rows actually hold them.
 */
async function list(db: Client, label: string, sql: string, args: unknown[] = []) {
  const result = await db.execute({ sql, args: args as never[] });
  console.log(`  ${label}: ${result.rows.length}`);
  for (const row of result.rows) {
    console.log(`    - ${Object.values(row).map(String).join(" | ")}`);
  }
  return result.rows.length;
}

async function run(db: Client, label: string, sql: string, args: unknown[] = []) {
  if (!APPLY) {
    console.log(`  [dry run] ${label}`);
    return;
  }
  const result = await db.execute({ sql, args: args as never[] });
  console.log(`  ✅ ${label} (${result.rowsAffected} row(s))`);
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) throw new Error("TURSO_DATABASE_URL is not set");

  const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });

  console.log(APPLY ? "⚠️  APPLYING to the live database\n" : "🔍 Dry run — nothing is written\n");

  // ---- 1. Placeholder media -------------------------------------------------
  // Detached from content first, so deleting the media row cannot orphan a
  // foreign key on a post an editor has since rewritten but not re-illustrated.
  const picsum = await count(
    db,
    "select count(*) n from media where url like '%picsum.photos%' or secure_url like '%picsum.photos%'",
  );
  console.log(`Placeholder images (picsum.photos): ${picsum}`);

  // What is actually wearing one of those images right now.
  await list(db, "blog posts", `${USING_PICSUM("blog_posts", "thumbnail_media_id")} select id, slug, title from t`);
  await list(db, "courses", `${USING_PICSUM("courses", "thumbnail_media_id")} select id, title from t`);
  await list(db, "events", `${USING_PICSUM("events", "poster_media_id")} select id, title from t`);
  await list(db, "activities", `${USING_PICSUM("activity_posts", "thumbnail_media_id")} select id, title from t`);
  await list(db, "team members", `${USING_PICSUM("team_members", "photo_media_id")} select id, name from t`);
  console.log();

  await run(
    db,
    "clear blog thumbnails pointing at a placeholder image",
    `update blog_posts set thumbnail_media_id = null where thumbnail_media_id in
       (select id from media where url like '%picsum.photos%' or secure_url like '%picsum.photos%')`,
  );
  await run(
    db,
    "clear course thumbnails pointing at a placeholder image",
    `update courses set thumbnail_media_id = null where thumbnail_media_id in
       (select id from media where url like '%picsum.photos%' or secure_url like '%picsum.photos%')`,
  );
  await run(
    db,
    "clear event posters pointing at a placeholder image",
    `update events set poster_media_id = null where poster_media_id in
       (select id from media where url like '%picsum.photos%' or secure_url like '%picsum.photos%')`,
  );
  await run(
    db,
    "clear activity thumbnails pointing at a placeholder image",
    `update activity_posts set thumbnail_media_id = null where thumbnail_media_id in
       (select id from media where url like '%picsum.photos%' or secure_url like '%picsum.photos%')`,
  );
  await run(
    db,
    "clear team photos pointing at a placeholder image",
    `update team_members set photo_media_id = null where photo_media_id in
       (select id from media where url like '%picsum.photos%' or secure_url like '%picsum.photos%')`,
  );
  await run(
    db,
    `delete ${picsum} placeholder image record(s)`,
    "delete from media where url like '%picsum.photos%' or secure_url like '%picsum.photos%'",
  );

  // ---- 2. Invented content --------------------------------------------------
  const blogs = await count(
    db,
    `select count(*) n from blog_posts where slug in (${placeholders(PLACEHOLDER_BLOG_SLUGS)})`,
    PLACEHOLDER_BLOG_SLUGS,
  );
  console.log(`\nInvented blog posts: ${blogs} of ${PLACEHOLDER_BLOG_SLUGS.length}`);
  await run(
    db,
    `delete ${blogs} invented blog post(s)`,
    `delete from blog_posts where slug in (${placeholders(PLACEHOLDER_BLOG_SLUGS)})`,
    PLACEHOLDER_BLOG_SLUGS,
  );

  const courses = await count(
    db,
    `select count(*) n from courses where title in (${placeholders(PLACEHOLDER_COURSE_TITLES)})`,
    PLACEHOLDER_COURSE_TITLES,
  );
  console.log(`Invented courses: ${courses} of ${PLACEHOLDER_COURSE_TITLES.length}`);
  await run(
    db,
    `delete ${courses} invented course(s)`,
    `delete from courses where title in (${placeholders(PLACEHOLDER_COURSE_TITLES)})`,
    PLACEHOLDER_COURSE_TITLES,
  );

  const events = await count(
    db,
    `select count(*) n from events where title in (${placeholders(PLACEHOLDER_EVENT_TITLES)})`,
    PLACEHOLDER_EVENT_TITLES,
  );
  console.log(`Invented events: ${events} of ${PLACEHOLDER_EVENT_TITLES.length}`);
  await run(
    db,
    `delete ${events} invented event(s)`,
    `delete from events where title in (${placeholders(PLACEHOLDER_EVENT_TITLES)})`,
    PLACEHOLDER_EVENT_TITLES,
  );

  // ---- 3. Menu --------------------------------------------------------------
  //
  // What the live menu actually holds, checked before writing any of this:
  // "Hakkımızda" already points at /about-us/, so it is left alone. What is
  // missing is Faaliyetler — there is no entry for the activities page at all,
  // and "Haberler & Blog" sends both names at the same blog listing.
  console.log("\nMenu");
  await list(
    db,
    "current menu",
    "select label, href, sort_order from navigation_items order by sort_order",
  );

  // "Biz Kimiz?" sits under Hakkımızda but points into the guide, so the
  // about-page section it names is unreachable from the menu.
  await run(
    db,
    "point 'Biz Kimiz?' at the about page section",
    "update navigation_items set href = '/about-us/#biz-kimiz' where label = 'Biz Kimiz?' and href like '%pakistan-rehberi%'",
  );

  await run(
    db,
    "rename 'Haberler & Blog' to 'Blog'",
    "update navigation_items set label = 'Blog' where label = 'Haberler & Blog'",
  );

  const hasActivities = await count(
    db,
    "select count(*) n from navigation_items where href like '/faaliyetler%'",
  );
  if (hasActivities === 0) {
    // Slotted immediately before Etkinlikler, at the top level. Everything from
    // that position down shifts by one so the existing order is preserved.
    const anchor = await count(
      db,
      "select coalesce(min(sort_order), 0) n from navigation_items where label = 'Etkinlikler'",
    );
    await run(
      db,
      `make room at position ${anchor}`,
      "update navigation_items set sort_order = sort_order + 1 where sort_order >= ?",
      [anchor],
    );
    await run(
      db,
      `add 'Faaliyetler' -> /faaliyetler/ at position ${anchor}`,
      `insert into navigation_items (id, parent_id, label, href, sort_order, is_visible)
         values ('nav-faaliyetler', null, 'Faaliyetler', '/faaliyetler/', ?, 1)`,
      [anchor],
    );
  } else {
    console.log("  'Faaliyetler' is already in the menu — left alone.");
  }

  // ---- 4. Supplied links ----------------------------------------------------
  console.log("\nSettings");
  for (const [key, value] of Object.entries(SETTINGS_TO_SET)) {
    await run(
      db,
      `${key} = ${value}`,
      `insert into site_settings (key, value, updated_at) values (?, ?, datetime('now'))
         on conflict(key) do update set value = excluded.value, updated_at = excluded.updated_at`,
      [key, value],
    );
  }

  const instagram = await count(
    db,
    "select count(*) n from social_accounts where platform = 'instagram'",
  );
  if (instagram > 0) {
    await run(
      db,
      `set the Instagram link to ${INSTAGRAM_URL}`,
      "update social_accounts set url = ?, active = 1, updated_at = datetime('now') where platform = 'instagram'",
      [INSTAGRAM_URL],
    );
  } else {
    await run(
      db,
      `add the Instagram account (${INSTAGRAM_URL})`,
      `insert into social_accounts (id, platform, label, url, active, open_in_new_tab, sort_order)
         values ('social-instagram', 'instagram', 'Instagram', ?, 1, 1, 1)`,
      [INSTAGRAM_URL],
    );
  }

  console.log(
    APPLY
      ? "\n✅ Done. Redeploy or wait 60s for the pages to revalidate."
      : "\n🔍 Dry run complete. Re-run with --apply to write these changes.",
  );
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Failed:", error);
  process.exit(1);
});
