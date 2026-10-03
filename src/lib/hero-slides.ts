import { isValidLinkTarget } from "@/lib/public-routes";

/**
 * The homepage hero as a list of slides, stored as one JSON value under
 * `home_hero_slides` in `site_settings`.
 *
 * Reads are lenient (a damaged value must never take the homepage down) and
 * writes are strict (anything that reaches the database has been checked).
 */

export interface HeroSlide {
  id: string;
  titleTop: string;
  titleBottom: string;
  summary: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  active: boolean;
}

export const HERO_SLIDES_KEY = "home_hero_slides";
export const MAX_HERO_SLIDES = 12;
export const MAX_ACTIVE_HERO_SLIDES = 5;

export type HeroSlidesError = "invalid" | "count" | "none_active" | "too_many_active" | "title" | "href";

export const HERO_SLIDES_ERROR_MESSAGES: Record<HeroSlidesError, string> = {
  invalid: "Slayt verisi okunamadı. Sayfayı yenileyip tekrar deneyin.",
  count: `En fazla ${MAX_HERO_SLIDES} slayt eklenebilir.`,
  none_active: "En az bir slayt yayında olmalı.",
  too_many_active: `Aynı anda en fazla ${MAX_ACTIVE_HERO_SLIDES} slayt yayında olabilir.`,
  title: "Her slaytın bir başlığı olmalı.",
  href: "Bir bağlantı geçerli değil. `/faaliyetler/` gibi bir site yolu veya `https://` ile başlayan bir adres girin.",
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalise(raw: unknown, index: number): HeroSlide | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const item = raw as Record<string, unknown>;
  return {
    id: clean(item.id, 60) || `slide-${index + 1}`,
    titleTop: clean(item.titleTop, 180),
    titleBottom: clean(item.titleBottom, 180),
    summary: clean(item.summary, 700),
    ctaLabel: clean(item.ctaLabel, 80),
    ctaHref: clean(item.ctaHref, 500),
    image: clean(item.image, 1_000),
    imageAlt: clean(item.imageAlt, 300),
    active: item.active !== false,
  };
}

/** Strict parse for writes. */
export function parseHeroSlides(
  input: unknown,
): { ok: true; slides: HeroSlide[] } | { ok: false; error: HeroSlidesError } {
  if (!Array.isArray(input)) return { ok: false, error: "invalid" };
  if (input.length > MAX_HERO_SLIDES) return { ok: false, error: "count" };

  const slides: HeroSlide[] = [];
  for (const [index, raw] of input.entries()) {
    const slide = normalise(raw, index);
    if (!slide) return { ok: false, error: "invalid" };
    if (!slide.titleTop && !slide.titleBottom) return { ok: false, error: "title" };
    if (slide.ctaHref && !isValidLinkTarget(slide.ctaHref)) return { ok: false, error: "href" };
    if (slide.image && !isValidLinkTarget(slide.image)) return { ok: false, error: "href" };
    slides.push(slide);
  }

  const active = slides.filter((slide) => slide.active).length;
  if (active === 0) return { ok: false, error: "none_active" };
  if (active > MAX_ACTIVE_HERO_SLIDES) return { ok: false, error: "too_many_active" };

  // Ids must be unique so the editor and the carousel can key on them.
  const seen = new Set<string>();
  for (const slide of slides) {
    while (seen.has(slide.id)) slide.id = `${slide.id}-${seen.size}`;
    seen.add(slide.id);
  }

  return { ok: true, slides };
}

/** Lenient read: a missing, damaged or empty value yields no slides. */
export function readHeroSlides(raw: string | undefined): HeroSlide[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value
      .slice(0, MAX_HERO_SLIDES)
      .map(normalise)
      .filter((slide): slide is HeroSlide => slide !== null && Boolean(slide.titleTop || slide.titleBottom));
  } catch {
    return [];
  }
}
