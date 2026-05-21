"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

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
    fetch("/api/admin/activities").then((r) => r.json()).then(setActivities).finally(() => setLoading(false));
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
        <Link href="/admin/activities/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"><Plus className="w-4 h-4" /> Yeni Aktivite</Link>
      </div>
      {loading ? <p className="text-text-muted">Yükleniyor...</p> : (
        <div className="bg-white rounded-card shadow-card border border-border-custom overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead><tr className="border-b border-border-custom text-left"><th className="p-4 text-sm font-semibold text-text-secondary">İkon</th><th className="p-4 text-sm font-semibold text-text-secondary">Başlık</th><th className="p-4 text-sm font-semibold text-text-secondary">Sıra</th><th className="p-4 text-sm font-semibold text-text-secondary text-right">İşlemler</th></tr></thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className="border-b border-border-custom hover:bg-surface/50">
                  <td className="p-4 text-lg">{a.icon}</td>
                  <td className="p-4 font-medium">{a.title}</td>
                  <td className="p-4 text-sm">{a.sortOrder}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/activities/${a.id}/edit`} className="p-2 text-text-secondary hover:text-primary"><Pencil className="w-4 h-4" /></Link>
                    <button onClick={() => handleDelete(a.id)} className="p-2 text-text-secondary hover:text-turkish-red"><Trash2 className="w-4 h-4" /></button>
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
