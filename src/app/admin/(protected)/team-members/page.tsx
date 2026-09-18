"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  order: number;
  isActive: boolean;
}

export default function TeamMembersListPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/team-members")
      .then((r) => r.json())
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/team-members/${id}`, { method: "DELETE" });
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">Ekip Üyeleri</h1>
        <Link href="/admin/team-members/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
          <Plus className="w-4 h-4" /> Yeni Üye
        </Link>
      </div>

      <DataTable
        loading={loading}
        data={members}
        columns={[
          { key: "name", header: "İsim" },
          { key: "role", header: "Rol" },
          { key: "order", header: "Sıra" },
          { key: "isActive", header: "Aktif", render: (m) => m.isActive ? "✅" : "❌" },
        ]}
        actions={(m) => (
          <div className="flex items-center justify-end gap-2">
            <Link href={`/admin/team-members/${m.id}/edit`} className="p-2 text-text-secondary hover:text-primary">
              <Pencil className="w-4 h-4" />
            </Link>
            <button onClick={() => handleDelete(m.id)} className="p-2 text-text-secondary hover:text-turkish-red">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />
    </div>
  );
}
