"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Ekip Üyeleri</h1>
        <Link href="/admin/team-members/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
          <Plus className="w-4 h-4" /> Yeni Üye
        </Link>
      </div>
      {loading ? <p className="text-text-muted">Yükleniyor...</p> : (
        <div className="bg-white rounded-card shadow-card border border-border-custom">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-custom text-left">
                <th className="p-4 text-sm font-semibold text-text-secondary">İsim</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Rol</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Sıra</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Aktif</th>
                <th className="p-4 text-sm font-semibold text-text-secondary text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-border-custom hover:bg-surface/50">
                  <td className="p-4 font-medium">{m.name}</td>
                  <td className="p-4 text-sm">{m.role}</td>
                  <td className="p-4 text-sm">{m.order}</td>
                  <td className="p-4 text-sm">{m.isActive ? "✅" : "❌"}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/team-members/${m.id}/edit`} className="p-2 text-text-secondary hover:text-primary"><Pencil className="w-4 h-4" /></Link>
                    <button onClick={() => handleDelete(m.id)} className="p-2 text-text-secondary hover:text-turkish-red"><Trash2 className="w-4 h-4" /></button>
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
