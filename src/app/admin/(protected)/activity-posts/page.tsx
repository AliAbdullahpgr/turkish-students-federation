"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { SavedNotice } from "@/components/admin/useAdminSubmit";

interface ActivityPost {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  location?: string | null;
  happenedAt?: string | null;
  isPublished?: boolean | null;
}

export default function ActivityPostsListPage() {
  const [posts, setPosts] = useState<ActivityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/activity-posts")
      .then((r) => r.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/activity-posts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("delete failed");
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-bold text-text-primary sm:text-2xl">
            Faaliyetler
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Yetimhane ziyareti, yıllık buluşma gibi gerçekleşen etkinlikler. Ana sayfadaki
            faaliyetler bölümü yalnızca en az bir yayınlanmış faaliyet varken görünür.
          </p>
        </div>
        <Link href="/admin/activity-posts/new" className="admin-button admin-button-primary">
          <Plus className="h-4 w-4" /> Yeni Faaliyet
        </Link>
      </div>

      <SavedNotice />


      <DataTable
        loading={loading}
        emptyMessage="Henüz faaliyet eklenmedi — ana sayfadaki bölüm gizli."
        data={posts}
        columns={[
          { key: "title", header: "Başlık" },
          { key: "category", header: "Kategori" },
          { key: "location", header: "Yer" },
          {
            key: "happenedAt",
            header: "Tarih",
            render: (post) => post.happenedAt?.split("T")[0] || "",
          },
          {
            key: "isPublished",
            header: "Durum",
            render: (post) => (post.isPublished ? "Yayında" : "Taslak"),
          },
        ]}
        actions={(post) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/activity-posts/${post.id}/edit`}
              aria-label={`${post.title} düzenle`}
              className="p-2 text-text-secondary hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <ConfirmDeleteButton label={post.title} onConfirm={() => handleDelete(post.id)} />
          </div>
        )}
      />
    </div>
  );
}
