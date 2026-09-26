import { homeMessaging } from "@/data/siteContent";
import { getAllSiteSettings } from "@/db/queries/site-settings";

/**
 * Every editable field on the homepage, in one list.
 *
 * Each band of the homepage used to carry its heading, lede and "view all"
 * link as literals inside its component — "Ne Yapıyoruz?", "Blog",
 * "Etkinliklerimiz", "Kurslarimiz", the Facebook card, the whole Biz Kimiz?
 * column. The admin panel could change the hero and nothing below it, which is
 * why the homepage read as uneditable.
 *
 * The spec below is the single source of truth: `getHomeContent` reads it for
 * the fallbacks, the `/admin/home` screen renders it as the form, and
 * `saveHomeContent` validates writes against it. Adding a field to a section is
 * one entry here and one line in the component — never a new form, route or
 * settings-key allowlist.
 */

export type HomeFieldKind = "text" | "long" | "href" | "image" | "toggle";

export interface HomeField {
  key: string;
  label: string;
  kind: HomeFieldKind;
  /** Rendered when the key has never been saved. Keeps an untouched install identical. */
  fallback: string;
  help?: string;
}

export interface HomeSectionSpec {
  id: string;
  label: string;
  description: string;
  fields: HomeField[];
  /** A section that has its own admin screen is listed here as a pointer only. */
  managedAt?: string;
}

const visibility = (key: string, label = "Bu bölümü sitede göster"): HomeField => ({
  key,
  label,
  kind: "toggle",
  fallback: "1",
});

export const HOME_SECTIONS: HomeSectionSpec[] = [
  {
    id: "hero",
    label: "Üst bölüm (Hero)",
    description: "Sayfanın en üstündeki büyük başlık, özet ve buton.",
    fields: [
      { key: "home_title_top", label: "Başlık — üst satır", kind: "text", fallback: homeMessaging.titleTop },
      {
        key: "home_title_bottom",
        label: "Başlık — alt satır (vurgulu)",
        kind: "text",
        fallback: homeMessaging.titleBottom,
        help: "Bu satır açık yeşil renkte gösterilir.",
      },
      {
        key: "home_summary",
        label: "Özet metin",
        kind: "long",
        fallback: homeMessaging.summary,
      },
      { key: "home_primary_cta", label: "Buton yazısı", kind: "text", fallback: "Faaliyetlerimiz" },
      {
        key: "home_hero_cta_href",
        label: "Buton bağlantısı",
        kind: "href",
        fallback: "/faaliyetler/",
        help: "Örn. /faaliyetler/, /about-us/, /events/",
      },
      {
        key: "home_hero_image",
        label: "Arka plan görseli",
        kind: "image",
        fallback: "/image/association-community-evening.png",
        help: "Yükleyin veya kütüphaneden seçin. Elle girerseniz /image/… ya da https://… ile başlamalıdır.",
      },
    ],
  },
  {
    id: "whoweare",
    label: "Biz Kimiz?",
    description: "Hero'nun hemen altındaki tanıtım bloğu.",
    fields: [
      { key: "home_whoweare_eyebrow", label: "Küçük üst yazı", kind: "text", fallback: "Biz Kimiz?" },
      {
        key: "home_whoweare_title",
        label: "Başlık",
        kind: "text",
        fallback: "Pakistan'da birlikte daha güçlü bir öğrenci topluluğu",
      },
      {
        key: "home_about_intro",
        label: "Ana metin",
        kind: "long",
        fallback: homeMessaging.aboutIntro,
        help: "Markdown yazabilirsiniz.",
      },
      {
        key: "home_whoweare_note",
        label: "Kapanış paragrafı",
        kind: "long",
        fallback:
          "Pakistan Türk Öğrenci Birliği, öğrencilerin Pakistan'daki akademik, sosyal ve kültürel hayata güvenle katılabilmesi için dayanışma, temsil ve bilgi paylaşımı sağlar.",
      },
      {
        key: "home_whoweare_link_label",
        label: "Bağlantı yazısı",
        kind: "text",
        fallback: "Birliğimizi tanıyın",
      },
      {
        key: "home_whoweare_link_href",
        label: "Bağlantı adresi",
        kind: "href",
        fallback: "/about-us/",
      },
      visibility("home_whoweare_visible"),
    ],
  },
  {
    id: "activityposts",
    label: "Faaliyetlerimiz (son faaliyetler)",
    description:
      "Ziyaret ve programların kartları. İçerikleri 'Faaliyetler' sayfasından ekleyip düzenlersiniz.",
    fields: [
      { key: "home_activities_title", label: "Başlık", kind: "text", fallback: "Faaliyetlerimiz" },
      {
        key: "home_activities_lede",
        label: "Açıklama",
        kind: "long",
        fallback: "Birliğimizin gerçekleştirdiği ziyaretler, buluşmalar ve programlar.",
      },
      {
        key: "home_activities_cta",
        label: "Bağlantı yazısı",
        kind: "text",
        fallback: "Tüm faaliyetler",
      },
      {
        key: "home_activities_href",
        label: "Bağlantı adresi",
        kind: "href",
        fallback: "/faaliyetler/",
      },
      visibility("home_activities_visible"),
    ],
  },
  {
    id: "whatwedo",
    label: "Ne Yapıyoruz?",
    description: "Birliğin çalışma alanlarını anlatan ikonlu kartlar ('Aktiviteler' bölümünden).",
    fields: [
      { key: "home_whatwedo_title", label: "Başlık", kind: "text", fallback: "Ne Yapıyoruz?" },
      { key: "home_whatwedo_lede", label: "Açıklama", kind: "long", fallback: "" },
      visibility("home_whatwedo_visible"),
    ],
  },
  {
    id: "blog",
    label: "Blog",
    description: "Son blog yazılarının kartları.",
    fields: [
      { key: "home_blog_title", label: "Başlık", kind: "text", fallback: "Blog" },
      {
        key: "home_blog_lede",
        label: "Açıklama",
        kind: "long",
        fallback: "Pakistan'da öğrenci hayatı için hikâyeler, bilgiler ve pratik öneriler.",
      },
      { key: "home_blog_cta", label: "Bağlantı yazısı", kind: "text", fallback: "Tüm bloglar" },
      {
        key: "home_blog_href",
        label: "Bağlantı adresi",
        kind: "href",
        fallback: "/news-blogs/?type=blog",
      },
      visibility("home_blog_visible"),
    ],
  },
  {
    id: "events",
    label: "Etkinliklerimiz",
    description: "Yaklaşan ve geçmiş etkinlik kartları.",
    fields: [
      { key: "home_events_title", label: "Başlık", kind: "text", fallback: "Etkinliklerimiz" },
      { key: "home_events_lede", label: "Açıklama", kind: "long", fallback: "" },
      { key: "home_events_cta", label: "Bağlantı yazısı", kind: "text", fallback: "Tüm etkinlikler" },
      { key: "home_events_href", label: "Bağlantı adresi", kind: "href", fallback: "/events/" },
      visibility("home_events_visible"),
    ],
  },
  {
    id: "president",
    label: "Başkan bölümü",
    description: "Başkanın fotoğrafı, adı ve özgeçmişi.",
    managedAt: "/admin/president",
    fields: [],
  },
  {
    id: "courses",
    label: "Kurslarımız",
    description: "Kurs kartları.",
    fields: [
      { key: "home_courses_title", label: "Başlık", kind: "text", fallback: "Kurslarımız" },
      { key: "home_courses_lede", label: "Açıklama", kind: "long", fallback: "" },
      visibility("home_courses_visible"),
    ],
  },
  {
    id: "youtube",
    label: "YouTube bölümü",
    description: "Kanal bağlantısı ve öne çıkan video.",
    managedAt: "/admin/youtube",
    fields: [],
  },
  {
    id: "facebook",
    label: "Facebook bölümü",
    description: "Sayfanın en altındaki Facebook kartı.",
    fields: [
      { key: "home_facebook_title", label: "Başlık", kind: "text", fallback: "Facebook Sayfamız" },
      {
        key: "home_facebook_body",
        label: "Metin",
        kind: "long",
        fallback: "En son güncellemeler ve etkinlikler için bizi Facebook'tan takip edin.",
      },
      {
        key: "home_facebook_url",
        label: "Facebook adresi",
        kind: "href",
        fallback: "https://facebook.com/tsfturkey",
      },
      { key: "home_facebook_cta", label: "Buton yazısı", kind: "text", fallback: "Facebook'ta takip et" },
      visibility("home_facebook_visible"),
    ],
  },
];

export const HOME_FIELDS: HomeField[] = HOME_SECTIONS.flatMap((section) => section.fields);

export const HOME_FIELD_BY_KEY = new Map(HOME_FIELDS.map((field) => [field.key, field]));

/** Longer fields get a longer cap; everything else is a single line of copy. */
export const MAX_HOME_LONG = 10_000;
export const MAX_HOME_SHORT = 500;

export function homeFieldMaxLength(field: HomeField) {
  return field.kind === "long" ? MAX_HOME_LONG : MAX_HOME_SHORT;
}

export interface HomeSectionCopy {
  title: string;
  lede: string;
  cta: string;
  href: string;
  visible: boolean;
}

export interface HomeContent {
  hero: {
    titleTop: string;
    titleBottom: string;
    summary: string;
    ctaLabel: string;
    ctaHref: string;
    image: string;
  };
  whoWeAre: {
    eyebrow: string;
    title: string;
    intro: string;
    note: string;
    linkLabel: string;
    linkHref: string;
    visible: boolean;
  };
  activityPosts: HomeSectionCopy;
  whatWeDo: Omit<HomeSectionCopy, "cta" | "href">;
  blog: HomeSectionCopy;
  events: HomeSectionCopy;
  courses: Omit<HomeSectionCopy, "cta" | "href">;
  facebook: { title: string; body: string; url: string; cta: string; visible: boolean };
}

/**
 * The homepage's saved copy, with every field falling back to the literal the
 * component used to hold.
 *
 * A saved empty string is honoured rather than replaced by the fallback —
 * clearing a lede in the panel must actually clear it on the site, otherwise
 * the field looks broken. Only a key that has never been written falls back.
 */
export async function getHomeContent(): Promise<HomeContent> {
  const settings = await getAllSiteSettings();

  const value = (key: string) => {
    const saved = settings[key];
    if (saved !== undefined) return saved;
    return HOME_FIELD_BY_KEY.get(key)?.fallback ?? "";
  };
  const enabled = (key: string) => value(key) !== "0";

  return {
    hero: {
      titleTop: value("home_title_top"),
      titleBottom: value("home_title_bottom"),
      summary: value("home_summary"),
      ctaLabel: value("home_primary_cta"),
      ctaHref: value("home_hero_cta_href"),
      image: value("home_hero_image"),
    },
    whoWeAre: {
      eyebrow: value("home_whoweare_eyebrow"),
      title: value("home_whoweare_title"),
      intro: value("home_about_intro"),
      note: value("home_whoweare_note"),
      linkLabel: value("home_whoweare_link_label"),
      linkHref: value("home_whoweare_link_href"),
      visible: enabled("home_whoweare_visible"),
    },
    activityPosts: {
      title: value("home_activities_title"),
      lede: value("home_activities_lede"),
      cta: value("home_activities_cta"),
      href: value("home_activities_href"),
      visible: enabled("home_activities_visible"),
    },
    whatWeDo: {
      title: value("home_whatwedo_title"),
      lede: value("home_whatwedo_lede"),
      visible: enabled("home_whatwedo_visible"),
    },
    blog: {
      title: value("home_blog_title"),
      lede: value("home_blog_lede"),
      cta: value("home_blog_cta"),
      href: value("home_blog_href"),
      visible: enabled("home_blog_visible"),
    },
    events: {
      title: value("home_events_title"),
      lede: value("home_events_lede"),
      cta: value("home_events_cta"),
      href: value("home_events_href"),
      visible: enabled("home_events_visible"),
    },
    courses: {
      title: value("home_courses_title"),
      lede: value("home_courses_lede"),
      visible: enabled("home_courses_visible"),
    },
    facebook: {
      title: value("home_facebook_title"),
      body: value("home_facebook_body"),
      url: value("home_facebook_url"),
      cta: value("home_facebook_cta"),
      visible: enabled("home_facebook_visible"),
    },
  };
}

/** The saved raw values, for the admin form. Unsaved keys come back as their fallback. */
export async function getHomeSettingsForAdmin(): Promise<Record<string, string>> {
  const settings = await getAllSiteSettings();
  const values: Record<string, string> = {};
  for (const field of HOME_FIELDS) {
    values[field.key] = settings[field.key] ?? field.fallback;
  }
  return values;
}
