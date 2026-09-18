"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  publishedAt?: string | null;
}

export default function BlogPostsListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/blog-posts")
      .then((r) => r.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/blog-posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">Blog Yazıları</h1>
        <Link
          href="/admin/blog-posts/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"
        >
          <Plus className="w-4 h-4" /> Yeni Yazı
        </Link>
      </div>

      <DataTable
        loading={loading}
        emptyMessage="Henüz blog yazısı yok."
        data={posts}
        columns={[
          { key: "title", header: "Başlık" },
          { key: "slug", header: "Slug" },
          { key: "category", header: "Kategori" },
          { key: "publishedAt", header: "Tarih", render: (post) => post.publishedAt?.split("T")[0] || "" },
        ]}
        actions={(post) => (
          <div className="flex items-center justify-end gap-2">
            <Link href={`/admin/blog-posts/${post.id}/edit`} className="p-2 text-text-secondary hover:text-primary">
              <Pencil className="w-4 h-4" />
            </Link>
            <button onClick={() => handleDelete(post.id)} className="p-2 text-text-secondary hover:text-turkish-red">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />
    </div>
  );
}
