export const navItems = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about-us/",
    children: [{ label: "About Us", href: "/about-us/" }],
  },
  { label: "Events", href: "/events/" },
  {
    label: "Join TSF",
    href: "/join-tsf/",
    children: [{ label: "Join TSF", href: "/join-tsf/" }],
  },
  { label: "News & Blogs", href: "/news-blogs/" },
  {
    label: "Literature",
    href: "/literature/",
    children: [{ label: "Literature", href: "/literature/" }],
  },
  { label: "Contact US", href: "/contact-us/" },
  {
    label: "Pages",
    href: "#",
    children: [
      { label: "Press Releases", href: "/press-releases/" },
      { label: "Our Departments", href: "/departments/" },
      { label: "Terms & Conditions", href: "/terms/" },
      { label: "Privacy Policy", href: "/privacy/" },
    ],
  },
];
