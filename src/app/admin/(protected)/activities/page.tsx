"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

interface Activity {
  id: string;
  title: string;
  icon: string;
  sortOrder: number;
}

export default function ActivitiesListPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/activities")
      .then((r) => r.json())
      .then(setActivities)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/activities/${id}`, { method: "DELETE" });
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">Aktiviteler</h1>
        <Link href="/admin/activities/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
          <Plus className="w-4 h-4" /> Yeni Aktivite
        </Link>
      </div>

      <DataTable
        loading={loading}
        data={activities}
        columns={[
          { key: "icon", header: "İkon", render: (a) => <span className="text-lg">{a.icon}</span> },
          { key: "title", header: "Başlık" },
          { key: "sortOrder", header: "Sıra" },
        ]}
        actions={(a) => (
          <div className="flex items-center justify-end gap-2">
            <Link href={`/admin/activities/${a.id}/edit`} className="p-2 text-text-secondary hover:text-primary">
              <Pencil className="w-4 h-4" />
            </Link>
            <button onClick={() => handleDelete(a.id)} className="p-2 text-text-secondary hover:text-turkish-red">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />
    </div>
  );
}
