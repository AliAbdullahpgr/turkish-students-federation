"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { SavedNotice } from "@/components/admin/useAdminSubmit";

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
    const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("delete failed");
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">Etkinlikler</h1>
        <Link
          href="/admin/events/new"
          className="admin-button admin-button-primary"
        >
          <Plus className="w-4 h-4" /> Yeni Etkinlik
        </Link>
      </div>

      <SavedNotice />


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
            <Link href={`/admin/events/${event.id}/edit`} aria-label={`${event.title} düzenle`} className="p-2 text-text-secondary hover:text-primary">
              <Pencil className="w-4 h-4" />
            </Link>
            <ConfirmDeleteButton label={event.title} onConfirm={() => handleDelete(event.id)} />
          </div>
        )}
      />
    </div>
  );
}
