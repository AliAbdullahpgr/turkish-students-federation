"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Users,
  BookOpen,
  Activity,
  FileText,
  Navigation,
  Settings,
  Image,
  Mail,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blog-posts", label: "Blog Yazıları", icon: Newspaper },
  { href: "/admin/events", label: "Etkinlikler", icon: Calendar },
  { href: "/admin/team-members", label: "Ekip Üyeleri", icon: Users },
  { href: "/admin/courses", label: "Kurslar", icon: BookOpen },
  { href: "/admin/activities", label: "Aktiviteler", icon: Activity },
  { href: "/admin/guide-sections", label: "Rehber Bölümleri", icon: FileText },
  { href: "/admin/navigation", label: "Navigasyon", icon: Navigation },
  { href: "/admin/site-settings", label: "Site Ayarları", icon: Settings },
  { href: "/admin/media", label: "Medya", icon: Image },
  { href: "/admin/contact-submissions", label: "İletişim Mesajları", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-primary text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="text-lg font-heading font-bold">
          PTÖB Admin
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-white/20 text-white font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <SignOutButton>
          <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors">
            Çıkış Yap
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
