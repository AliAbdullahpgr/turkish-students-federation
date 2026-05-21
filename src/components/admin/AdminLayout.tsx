"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <div
        className={`${
          sidebarOpen
            ? "fixed inset-0 z-50 lg:relative lg:z-auto"
            : "hidden lg:block"
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

      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <button
          className="lg:hidden mb-4 p-2 -ml-2 text-text-secondary hover:text-accent rounded-md"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menüyü aç"
        >
          <Menu className="w-5 h-5" />
        </button>
        {children}
      </main>
    </div>
  );
}
