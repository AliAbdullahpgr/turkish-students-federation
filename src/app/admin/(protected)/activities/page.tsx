"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { SavedNotice } from "@/components/admin/useAdminSubmit";

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
    const res = await fetch(`/api/admin/activities/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("delete failed");
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">Aktiviteler</h1>
        <Link href="/admin/activities/new" className="admin-button admin-button-primary">
          <Plus className="w-4 h-4" /> Yeni Aktivite
        </Link>
      </div>

      <SavedNotice />


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
            <Link href={`/admin/activities/${a.id}/edit`} aria-label={`${a.title} düzenle`} className="p-2 text-text-secondary hover:text-primary">
              <Pencil className="w-4 h-4" />
            </Link>
            <ConfirmDeleteButton label={a.title} onConfirm={() => handleDelete(a.id)} />
          </div>
        )}
      />
    </div>
  );
}
