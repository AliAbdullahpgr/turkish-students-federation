"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

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
    fetch("/api/admin/guide-sections")
      .then((r) => r.json())
      .then(setSections)
      .finally(() => setLoading(false));
  }, []);

  async function togglePublish(id: string, current: boolean) {
    await fetch(`/api/admin/guide-sections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    });
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, isPublished: !current } : s)));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">Rehber Bölümleri</h1>
        <Link href="/admin/guide-sections/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
          <Plus className="w-4 h-4" /> Yeni Bölüm
        </Link>
      </div>

      <DataTable
        loading={loading}
        data={sections}
        columns={[
          {
            key: "title",
            header: "Başlık",
            render: (s) => (
              <span className="font-medium" style={{ paddingLeft: `${(s.level - 1) * 24}px` }}>
                {s.title}
              </span>
            ),
          },
          { key: "level", header: "Seviye" },
          { key: "parentId", header: "Üst ID", render: (s) => s.parentId || "-" },
          { key: "sortOrder", header: "Sıra" },
          {
            key: "isPublished",
            header: "Yayında",
            render: (s) => (
              <button
                onClick={() => togglePublish(s.id, s.isPublished)}
                className={s.isPublished ? "text-accent" : "text-text-muted"}
              >
                {s.isPublished ? "✅" : "❌"}
              </button>
            ),
          },
        ]}
        actions={(s) => (
          <Link href={`/admin/guide-sections/${s.id}/edit`} className="p-2 text-text-secondary hover:text-primary">
            <Pencil className="w-4 h-4" />
          </Link>
        )}
      />
    </div>
  );
}
