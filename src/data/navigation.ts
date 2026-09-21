import { siteIdentity } from "@/data/siteContent";

/**
 * The fallback menu, and the shape the live menu is seeded from. The live menu
 * itself is rows in `navigation_items`, editable at `/admin/navigation`.
 *
 * "Hakkımızda" points at `/about-us/`, not at the blog listing. "Haberler",
 * which pointed at `/news-blogs/?type=news`, is now "Faaliyetler" → the
 * activities page: what the association publishes are the things it did, and
 * the news filter showed the same posts as Blog under a second name.
 */
export const navItems = [
  { label: "Ana Sayfa", href: "/" },
  {
    label: "Hakkımızda",
    href: "/about-us/",
    children: [
      { label: "Biz Kimiz?", href: "/about-us/#biz-kimiz" },
      { label: "Hakkımızda", href: "/about-us/" },
      { label: "Birimlerimiz", href: "/departments/" },
    ],
  },
  { label: "Faaliyetler", href: "/faaliyetler/" },
  { label: "Etkinlikler", href: "/events/" },
  { label: "Blog", href: "/news-blogs/?type=blog" },
  {
    label: "Yayınlar",
    href: "/literature/",
    children: [
      { label: "Kitaplar", href: "/books/" },
      { label: "Bülten", href: "/newsletter/" },
    ],
  },
  { label: "Bize Katıl", href: siteIdentity.joinHref },
  { label: "İletişim", href: "/contact-us/" },
];
