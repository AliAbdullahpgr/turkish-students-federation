"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-surface">
      <div
        className={`${
          sidebarOpen
            ? "fixed inset-0 z-50 lg:relative lg:z-auto"
            : "hidden lg:block lg:shrink-0"
        }`}
      >
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="relative z-50 lg:z-auto">
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 lg:p-8">
          <button
            className="lg:hidden mb-4 p-2 -ml-2 text-text-secondary hover:text-accent rounded-md"
            onClick={() => setSidebarOpen(true)}
            aria-label="Menüyü aç"
          >
            <Menu className="w-5 h-5" />
          </button>
          {children}
        </div>
      </main>
    </div>
  );
}
