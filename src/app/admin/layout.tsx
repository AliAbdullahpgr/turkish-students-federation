import type { Metadata } from "next";
import "./admin.css";
import "./admin-skin.css";

/**
 * The admin panel's shared chrome-free wrapper.
 *
 * This layout deliberately does no auth work: it also wraps `/admin/login`,
 * which has to stay reachable while signed out. Protection lives one level
 * down, in `(protected)/layout.tsx`, so every page inside that group is gated
 * by construction rather than by remembering to add a check.
 *
 * `noindex` keeps the login page out of search results. robots.txt disallows
 * the same paths, and a disallowed page can still be indexed from an external
 * link, so both are needed.
 */
export const metadata: Metadata = {
  title: { default: "PTÖB yönetim", template: "%s — PTÖB yönetim" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
