import { guideSourceSections, siteIdentity } from "@/data/siteContent";

export const navItems = [
  { label: "Ana Sayfa", href: "/" },
  {
    label: "Pakistan Rehberi",
    href: siteIdentity.guideHref,
    children: guideSourceSections.map((section) => ({
      label: section.title,
      href: section.href,
    })),
  },
  {
    label: "Hakkımızda",
    href: "/about-us/",
    children: [
      { label: "Biz Kimiz?", href: "/pakistan-rehberi/#biz-kimiz" },
      { label: "Hakkımızda", href: "/about-us/" },
      { label: "Birimlerimiz", href: "/departments/" },
    ],
  },
  { label: "Etkinlikler", href: "/events/" },
  { label: "Haberler & Blog", href: "/news-blogs/" },
  {
    label: "Yayınlar",
    href: "/literature/",
    children: [
      { label: "Edebiyat", href: "/literature/" },
      { label: "The Students Times", href: "/students-times/" },
      { label: "Kitaplar", href: "/books/" },
      { label: "Bülten", href: "/newsletter/" },
      { label: "Basın Açıklamaları", href: "/press-releases/" },
    ],
  },
  { label: "Bize Katıl", href: siteIdentity.joinHref },
  { label: "İletişim", href: "/contact-us/" },
];
