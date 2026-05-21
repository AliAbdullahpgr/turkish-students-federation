"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

interface GuideSection {
  id: string;
  title: string;
  parentId: string | null;
  level: number;
  sortOrder: number;
  isPublished: boolean;
}

export default function GuideSectionsListPage() {
  const [sections, setSections] = useState<GuideSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/guide-sections").then((r) => r.json()).then(setSections).finally(() => setLoading(false));
  }, []);

  async function togglePublish(id: string, current: boolean) {
    await fetch(`/api/admin/guide-sections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    });
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, isPublished: !current } : s));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Rehber Bölümleri</h1>
        <Link href="/admin/guide-sections/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"><Plus className="w-4 h-4" /> Yeni Bölüm</Link>
      </div>
      {loading ? <p className="text-text-muted">Yükleniyor...</p> : (
        <div className="bg-white rounded-card shadow-card border border-border-custom">
          <table className="w-full">
            <thead><tr className="border-b border-border-custom text-left"><th className="p-4 text-sm font-semibold text-text-secondary">Başlık</th><th className="p-4 text-sm font-semibold text-text-secondary">Seviye</th><th className="p-4 text-sm font-semibold text-text-secondary">Üst ID</th><th className="p-4 text-sm font-semibold text-text-secondary">Sıra</th><th className="p-4 text-sm font-semibold text-text-secondary">Yayında</th></tr></thead>
            <tbody>
              {sections.map((s) => (
                <tr key={s.id} className="border-b border-border-custom hover:bg-surface/50">
                  <td className="p-4 font-medium" style={{ paddingLeft: `${(s.level - 1) * 24 + 16}px` }}>{s.title}</td>
                  <td className="p-4 text-sm">{s.level}</td>
                  <td className="p-4 text-sm text-text-muted">{s.parentId || "-"}</td>
                  <td className="p-4 text-sm">{s.sortOrder}</td>
                  <td className="p-4 text-sm">
                    <button onClick={() => togglePublish(s.id, s.isPublished)} className={s.isPublished ? "text-accent" : "text-text-muted"}>
                      {s.isPublished ? "✅" : "❌"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
