const publicRoutePrefixes = [
  "/",
  "/about-us/",
  "/books/",
  "/contact-us/",
  "/departments/",
  "/events/",
  "/join-tsf/",
  "/literature/",
  "/news-blogs/",
  "/newsletter/",
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
