"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

interface EventItem {
  id: string;
  title: string;
  category?: string | null;
  status: string;
  date?: string | null;
  location?: string | null;
}

export default function EventsListPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/events")
      .then((r) => r.json())
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu etkinliği silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">Etkinlikler</h1>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"
        >
          <Plus className="w-4 h-4" /> Yeni Etkinlik
        </Link>
      </div>

      <DataTable
        loading={loading}
        data={events}
        columns={[
          { key: "title", header: "Başlık" },
          { key: "category", header: "Kategori" },
          {
            key: "status",
            header: "Durum",
            render: (event) => (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                event.status === "upcoming" ? "bg-accent/10 text-accent" : "bg-surface text-text-muted"
              }`}>
                {event.status === "upcoming" ? "Yaklaşan" : "Geçmiş"}
              </span>
            ),
          },
          { key: "date", header: "Tarih" },
          { key: "location", header: "Konum" },
        ]}
        actions={(event) => (
          <div className="flex items-center justify-end gap-2">
            <Link href={`/admin/events/${event.id}/edit`} className="p-2 text-text-secondary hover:text-primary">
              <Pencil className="w-4 h-4" />
            </Link>
            <button onClick={() => handleDelete(event.id)} className="p-2 text-text-secondary hover:text-turkish-red">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />
    </div>
  );
}
