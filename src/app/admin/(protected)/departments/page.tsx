"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

interface Department {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number | null;
  isPublished: boolean | null;
  members: unknown[];
}

export default function DepartmentsListPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(new URLSearchParams(window.location.search).has("saved"));
    fetch("/api/admin/departments")
      .then((r) => r.json())
      .then(setDepartments)
      .catch(() => setError("Birimler yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    setError(null);
    const res = await fetch(`/api/admin/departments/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Birim silinemedi. Lütfen tekrar deneyin.");
      return;
    }
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    setConfirmingId(null);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-bold text-text-primary sm:text-2xl">Birimler</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Birimler sayfasındaki kartlar ve her birimin kendi sayfası. Kapalı (taslak) birimler sitede görünmez.
          </p>
        </div>
        <Link href="/admin/departments/new" className="admin-button admin-button-primary">
          <Plus className="h-4 w-4" /> Yeni Birim
        </Link>
      </div>

      {saved && (
        <p role="status" className="mb-4 rounded-md border border-border-custom bg-white px-4 py-3 text-sm text-text-primary">
          Birim kaydedildi.
        </p>
      )}

      {error && (
        <p role="alert" className="mb-4 rounded-md border border-turkish-red/30 bg-turkish-red/5 px-4 py-3 text-sm text-turkish-red">
          {error}
        </p>
      )}

      <DataTable
        loading={loading}
        emptyMessage="Henüz birim eklenmedi."
        data={departments}
        columns={[
          { key: "icon", header: "Simge", render: (d) => <span className="text-lg">{d.icon}</span> },
          { key: "name", header: "Birim" },
          { key: "members", header: "Üye", render: (d) => d.members.length },
          { key: "sortOrder", header: "Sıra" },
          { key: "isPublished", header: "Durum", render: (d) => (d.isPublished ? "Yayında" : "Taslak") },
        ]}
        actions={(d) =>
          confirmingId === d.id ? (
            <div className="flex items-center justify-end gap-2 text-sm">
              <span>Silinsin mi?</span>
              <button onClick={() => handleDelete(d.id)} className="admin-button admin-button-primary">
                Evet, sil
              </button>
              <button onClick={() => setConfirmingId(null)} className="admin-button admin-button-secondary">
                Vazgeç
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/admin/departments/${d.id}/edit`} aria-label={`${d.name} düzenle`} className="p-2 text-text-secondary hover:text-primary">
                <Pencil className="h-4 w-4" />
              </Link>
              <button onClick={() => setConfirmingId(d.id)} aria-label={`${d.name} sil`} className="p-2 text-text-secondary hover:text-turkish-red">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )
        }
      />
    </div>
  );
}
