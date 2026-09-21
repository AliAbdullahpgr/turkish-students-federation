"use client";

import {
  Activity,
  BookOpen,
  Calendar,
  ChevronDown,
  FileText,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  Mail,
  Menu,
  Newspaper,
  Search,
  Type,
  UserSquare,
  Users,
  CirclePlay,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

/**
 * Structured after Payload 3's admin shell (`.template-default`): a sticky
 * full-height nav column beside a content column whose own header carries the
 * breadcrumb trail. Payload's nav is text-only — no icons, no pills, no accent
 * fills — so the current page is marked with weight plus a 2px indicator bar
 * bled into the nav gutter.
 */

type NavItem = {
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navigation: NavGroup[] = [
  {
    label: "Genel",
    items: [{ href: "/admin", label: "Genel bakış", description: "Yayın durumu ve kısayollar", icon: LayoutDashboard }],
  },
  {
    label: "Website içeriği",
    items: [
      { href: "/admin/home", label: "Anasayfa bölümleri", description: "Her bölümün başlığı, metni ve görünürlüğü", icon: Home },
      { href: "/admin/site-settings", label: "Genel site ayarları", description: "Site adı, açıklama, bağlantılar", icon: Type },
      { href: "/admin/president", label: "Başkan bölümü", description: "Anasayfadaki başkan kartı", icon: UserSquare },
      { href: "/admin/youtube", label: "YouTube bölümü", description: "Kanal ve öne çıkan video", icon: CirclePlay },
      { href: "/admin/social", label: "Sosyal medya hesapları", description: "Instagram, YouTube, Facebook", icon: Link2 },
      { href: "/admin/navigation", label: "Navigasyon", description: "Menü bağlantıları ve sırası", icon: Link2 },
    ],
  },
  {
    label: "İçerik yönetimi",
    items: [
      { href: "/admin/blog-posts", label: "Blog ve haberler", description: "Yazılar ve yayın durumu", icon: Newspaper },
      { href: "/admin/activity-posts", label: "Faaliyetler", description: "Gerçekleşen etkinlikler ve ziyaretler", icon: Activity },
      { href: "/admin/events", label: "Etkinlikler", description: "Yaklaşan ve geçmiş etkinlikler", icon: Calendar },
      { href: "/admin/activities", label: "Aktiviteler", description: "Faaliyet kartları", icon: Activity },
      { href: "/admin/courses", label: "Kurslar", description: "Kurs listesi", icon: BookOpen },
      { href: "/admin/guide-sections", label: "Rehber bölümleri", description: "Pakistan rehberi içeriği", icon: FileText },
    ],
  },
  {
    label: "Kurum",
    items: [{ href: "/admin/team-members", label: "Ekip üyeleri", description: "Yönetim ve ekip kartları", icon: Users }],
  },
  {
    label: "İletişim",
    items: [
      {
        href: "/admin/contact-submissions",
        label: "İletişim mesajları",
        description: "Website iletişim formu",
        icon: Mail,
      },
    ],
  },
  {
    label: "Sistem",
    items: [
      { href: "/admin/media", label: "Medya kütüphanesi", description: "Tekrar kullanılabilir görseller", icon: ImageIcon },
    ],
  },
];

const NAV_GROUPS_STORAGE_KEY = "ptob-admin-nav-groups";

function normalize(value: string) {
  return value.toLocaleLowerCase("tr-TR");
}

function isItemActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function findActive(pathname: string) {
  for (const group of navigation) {
    const item = group.items.find((candidate) => isItemActive(pathname, candidate.href));
    if (item) return { group, item };
  }
  return null;
}

type Crumb = { label: string; href?: string };

function buildCrumbs(pathname: string): Crumb[] {
  const active = findActive(pathname);
  if (!active) return [{ label: "Yönetim paneli" }];

  const { group, item } = active;
  const crumbs: Crumb[] = [{ label: group.label }, { label: item.label, href: item.href }];

  if (item.href === "/admin") return crumbs;

  // Everything past the section root is either "new" or an edit of one record.
  const extras = pathname.slice(item.href.length).split("/").filter(Boolean);
  for (const segment of extras) {
    if (segment === "edit") continue;
    crumbs.push({ label: segment === "new" ? "Yeni" : "Düzenle" });
  }

  return crumbs.map((crumb, index) =>
    index === crumbs.length - 1 ? { label: crumb.label } : crumb,
  );
}

export default function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [navQuery, setNavQuery] = useState("");
  const [closedGroups, setClosedGroups] = useState<Record<string, boolean>>({});
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasNavOpen = useRef(false);
  const crumbs = useMemo(() => buildCrumbs(pathname), [pathname]);
  const activeGroupLabel = useMemo(() => findActive(pathname)?.group.label ?? "", [pathname]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(NAV_GROUPS_STORAGE_KEY);
      if (stored) setClosedGroups(JSON.parse(stored) as Record<string, boolean>);
    } catch {
      // Blocked or corrupt storage just means every group starts open.
    }
  }, []);

  useEffect(() => {
    if (!navOpen) {
      if (wasNavOpen.current) menuButtonRef.current?.focus({ preventScroll: true });
      wasNavOpen.current = false;
      return;
    }
    wasNavOpen.current = true;
    closeButtonRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  useEffect(() => {
    setNavOpen(false);
    setNavQuery("");
  }, [pathname]);

  function toggleGroup(label: string) {
    setClosedGroups((current) => {
      const next = { ...current, [label]: !current[label] };
      try {
        window.localStorage.setItem(NAV_GROUPS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Persisting is a convenience; the toggle still works this session.
      }
      return next;
    });
  }

  async function signOut() {
    await authClient.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const query = normalize(navQuery.trim());
  const filteredGroups = useMemo(() => {
    if (!query) return navigation;
    return navigation
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            normalize(item.label).includes(query) ||
            normalize(item.description ?? "").includes(query) ||
            normalize(group.label).includes(query),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <div className={`pl-shell ${navOpen ? "nav-open" : ""}`}>
      <nav className="pl-nav" aria-label="Yönetim paneli navigasyonu">
        <div className="pl-nav__header">
          <Link href="/admin" className="pl-nav__brand" onClick={() => setNavOpen(false)}>
            PTÖB yönetim
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            className="pl-nav__close"
            onClick={() => setNavOpen(false)}
            aria-label="Menüyü kapat"
          >
            <X className="pl-icon" aria-hidden="true" />
          </button>
        </div>

        <div className="pl-nav__scroll">
          {/* Brand block: the mark, the name, and what this screen is. */}
          <Link
            href="/admin"
            className="pl-nav__brand-block"
            onClick={() => setNavOpen(false)}
          >
            <span className="pl-nav__brand-mark" aria-hidden="true">
              PTÖB
            </span>
            <span>
              <span className="pl-nav__brand-name">PTÖB</span>
              <span className="pl-nav__brand-sub">Yönetim Paneli</span>
            </span>
          </Link>

          <div className="pl-nav__search">
            <Search className="pl-icon" aria-hidden="true" />
            <label className="sr-only" htmlFor="pl-nav-search">
              Menüde ara
            </label>
            <input
              id="pl-nav-search"
              type="search"
              value={navQuery}
              onChange={(event) => setNavQuery(event.target.value)}
              placeholder="Menüde ara…"
              autoComplete="off"
            />
            {navQuery && (
              <button type="button" onClick={() => setNavQuery("")} aria-label="Aramayı temizle">
                <X className="pl-icon-sm" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="pl-nav__wrap">
            {filteredGroups.map((group) => {
              const groupId = `pl-nav-${group.label.replace(/\s+/g, "-")}`;
              const open =
                Boolean(query) || group.label === activeGroupLabel || !closedGroups[group.label];
              return (
                <div className="pl-nav-group" key={group.label}>
                  <button
                    type="button"
                    className="pl-nav-group__toggle"
                    onClick={() => toggleGroup(group.label)}
                    aria-expanded={open}
                    aria-controls={groupId}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={`pl-nav-group__indicator ${open ? "" : "is-closed"}`}
                      aria-hidden="true"
                    />
                  </button>
                  {open && (
                    <div className="pl-nav-group__content" id={groupId}>
                      {group.items.map(({ href, label, icon: Icon }) => {
                        const active = isItemActive(pathname, href);
                        return (
                          <Link
                            key={href}
                            href={href}
                            className={`pl-nav__link ${active ? "active" : ""}`}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setNavOpen(false)}
                          >
                            {active && (
                              <span className="pl-nav__link-indicator" aria-hidden="true" />
                            )}
                            <Icon className="pl-nav__link-icon" aria-hidden="true" />
                            <span>{label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {query && filteredGroups.length === 0 && (
              <p className="pl-nav__empty">&ldquo;{navQuery}&rdquo; için sonuç yok.</p>
            )}
          </div>

          <div className="pl-nav__controls">
            <span className="pl-nav__link">{userName}</span>
            <button type="button" onClick={signOut} className="pl-nav__link pl-nav__logout">
              Oturumu kapat
            </button>
          </div>
        </div>
      </nav>

      {navOpen && (
        <button
          type="button"
          className="pl-nav__backdrop"
          aria-label="Menüyü kapat"
          onClick={() => setNavOpen(false)}
        />
      )}

      <div className="pl-wrap">
        <header className="pl-app-header">
          <button
            ref={menuButtonRef}
            type="button"
            className="pl-app-header__toggler"
            onClick={() => setNavOpen(true)}
            aria-label="Navigasyon menüsünü aç"
            aria-expanded={navOpen}
          >
            <Menu className="pl-icon" aria-hidden="true" />
          </button>

          <nav className="pl-step-nav" aria-label="Sayfa yolu">
            {crumbs.map((crumb, index) => (
              <span className="pl-step-nav__step" key={`${crumb.label}-${index}`}>
                {index > 0 && (
                  <span className="pl-step-nav__sep" aria-hidden="true">
                    /
                  </span>
                )}
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : index === crumbs.length - 1 ? (
                  <span className="pl-step-nav__current" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <div className="pl-app-header__actions">
            <Link href="/" target="_blank" rel="noreferrer" className="pl-btn pl-btn--subtle">
              Website&apos;i görüntüle
            </Link>
          </div>
        </header>

        <main className="pl-main">{children}</main>
      </div>
    </div>
  );
}
