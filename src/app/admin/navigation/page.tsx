"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Fragment } from "react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  parentId: string | null;
  sortOrder: number;
  isVisible: boolean;
}

export default function NavigationListPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/navigation")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  async function toggleVisibility(id: string, current: boolean) {
    await fetch(`/api/admin/navigation/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: !current }),
    });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isVisible: !current } : i)));
  }

  async function handleDelete(id: string) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/navigation/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const topLevel = items.filter((i) => !i.parentId);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">Navigasyon</h1>
        <Link href="/admin/navigation/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
          <Plus className="w-4 h-4" /> Yeni Link
        </Link>
      </div>

      {loading ? (
        <p className="text-text-muted">Yükleniyor...</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-card shadow-card border border-border-custom p-12 text-center">
          <p className="text-text-muted">Henüz navigasyon linki yok.</p>
        </div>
      ) : (
        <div className="bg-white rounded-card shadow-card border border-border-custom overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-custom text-left">
                <th className="p-4 text-sm font-semibold text-text-secondary">Etiket</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Link</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Sıra</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Görünür</th>
                <th className="p-4 text-sm font-semibold text-text-secondary text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {topLevel.map((item) => {
                const children = items.filter((i) => i.parentId === item.id);
                return (
                  <Fragment key={item.id}>
                    <tr className="border-b border-border-custom hover:bg-surface/50 bg-surface/30">
                      <td className="p-4 font-medium">{item.label}</td>
                      <td className="p-4 text-sm">{item.href}</td>
                      <td className="p-4 text-sm">{item.sortOrder}</td>
                      <td className="p-4 text-sm">
                        <button onClick={() => toggleVisibility(item.id, item.isVisible)}>
                          {item.isVisible ? "✅" : "❌"}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/navigation/${item.id}/edit`} className="p-2 text-text-secondary hover:text-primary">
                          Düzenle
                        </Link>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-text-secondary hover:text-turkish-red ml-1">
                          Sil
                        </button>
                      </td>
                    </tr>
                    {children.map((child) => (
                      <tr key={child.id} className="border-b border-border-custom hover:bg-surface/50">
                        <td className="p-4 pl-8 text-sm">↳ {child.label}</td>
                        <td className="p-4 text-sm text-text-muted">{child.href}</td>
                        <td className="p-4 text-sm">{child.sortOrder}</td>
                        <td className="p-4 text-sm">
                          <button onClick={() => toggleVisibility(child.id, child.isVisible)}>
                            {child.isVisible ? "✅" : "❌"}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <Link href={`/admin/navigation/${child.id}/edit`} className="p-2 text-text-secondary hover:text-primary">
                            Düzenle
                          </Link>
                          <button onClick={() => handleDelete(child.id)} className="p-2 text-text-secondary hover:text-turkish-red ml-1">
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
