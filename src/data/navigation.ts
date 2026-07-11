import { siteIdentity } from "@/data/siteContent";

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
  { label: "Etkinlikler", href: "/events/" },
  { label: "Haberler", href: "/news-blogs/?type=news" },
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
