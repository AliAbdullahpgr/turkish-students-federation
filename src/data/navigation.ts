export const navItems = [
  { label: "Ana Sayfa", href: "/" },
  {
    label: "Hakkımızda",
    href: "/about-us/",
    children: [{ label: "Hakkımızda", href: "/about-us/" }],
  },
  { label: "Etkinlikler", href: "/events/" },
  {
    label: "Bize Katıl",
    href: "/join-tsf/",
    children: [{ label: "Bize Katıl", href: "/join-tsf/" }],
  },
  { label: "Haberler & Blog", href: "/news-blogs/" },
  {
    label: "Edebiyat",
    href: "/literature/",
    children: [{ label: "Edebiyat", href: "/literature/" }],
  },
  { label: "Pakistan Rehberi", href: "/pakistan-rehberi/" },
  { label: "İletişim", href: "/contact-us/" },
  {
    label: "Sayfalar",
    href: "#",
    children: [
      { label: "Basın Açıklamaları", href: "/press-releases/" },
      { label: "Birimlerimiz", href: "/departments/" },
      { label: "Kullanım Koşulları", href: "/terms/" },
      { label: "Gizlilik Politikası", href: "/privacy/" },
    ],
  },
];
