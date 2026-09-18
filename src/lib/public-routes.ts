const publicRoutePrefixes = [
  "/",
  "/about-us/",
  "/books/",
  "/contact-us/",
  "/departments/",
  "/events/",
  "/faaliyetler/",
  "/join-tsf/",
  "/literature/",
  "/news-blogs/",
  "/newsletter/",
  "/pakistan-rehberi/",
  "/press-releases/",
  "/privacy/",
  "/students-times/",
  "/terms/",
];

export function isKnownPublicHref(value: string) {
  if (value === "/" || value.startsWith("#")) return true;
  if (!value.startsWith("/") || value.startsWith("//")) return false;

  const pathname = value.split(/[?#]/, 1)[0];
  return publicRoutePrefixes.some((route) => route !== "/" && pathname.startsWith(route));
}

export function normalizePublicHref(value: string) {
  return isKnownPublicHref(value) ? value : "/";
}

/**
 * Whether a string is safe to use as a link or image `src` set from the admin.
 *
 * Accepts site-relative paths, mailto/tel, and absolute http(s) addresses.
 * Everything else is rejected — `javascript:` in particular — so a pasted
 * string cannot become an executable link. Protocol-relative `//host` is
 * refused too, since it silently leaves the site.
 */
export function isValidLinkTarget(value: string) {
  const href = value.trim();
  if (!href) return false;
  if (href.startsWith("/")) return !href.startsWith("//");
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return href.length > 8;
  return /^https?:\/\/[^\s]+$/i.test(href);
}
