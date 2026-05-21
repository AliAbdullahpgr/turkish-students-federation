"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

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
          <Plus className="w-4 h-4" />
          Yeni Etkinlik
        </Link>
      </div>

      {loading ? (
        <p className="text-text-muted">Yükleniyor...</p>
      ) : (
        <div className="bg-white rounded-card shadow-card border border-border-custom overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border-custom text-left">
                <th className="p-4 text-sm font-semibold text-text-secondary">Başlık</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Kategori</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Durum</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Tarih</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Konum</th>
                <th className="p-4 text-sm font-semibold text-text-secondary text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-border-custom last:border-b-0 hover:bg-surface/50">
                  <td className="p-4 font-medium text-text-primary">{event.title}</td>
                  <td className="p-4 text-sm">{event.category}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      event.status === "upcoming" ? "bg-accent/10 text-accent" : "bg-surface text-text-muted"
                    }`}>
                      {event.status === "upcoming" ? "Yaklaşan" : "Geçmiş"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-text-muted">{event.date}</td>
                  <td className="p-4 text-sm text-text-muted">{event.location}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/events/${event.id}/edit`} className="p-2 text-text-secondary hover:text-primary">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(event.id)} className="p-2 text-text-secondary hover:text-turkish-red">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
