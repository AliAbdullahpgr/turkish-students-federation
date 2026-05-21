"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Blog Yazıları</h1>
        <Link
          href="/admin/blog-posts/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Yazı
        </Link>
      </div>

      {loading ? (
        <p className="text-text-muted">Yükleniyor...</p>
      ) : (
        <div className="bg-white rounded-card shadow-card border border-border-custom">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-custom text-left">
                <th className="p-4 text-sm font-semibold text-text-secondary">Başlık</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Slug</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Kategori</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Tarih</th>
                <th className="p-4 text-sm font-semibold text-text-secondary text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border-custom last:border-b-0 hover:bg-surface/50">
                  <td className="p-4 font-medium text-text-primary">{post.title}</td>
                  <td className="p-4 text-sm text-text-muted">{post.slug}</td>
                  <td className="p-4 text-sm">{post.category}</td>
                  <td className="p-4 text-sm text-text-muted">{post.publishedAt?.split("T")[0]}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog-posts/${post.id}/edit`}
                        className="p-2 text-text-secondary hover:text-primary transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-text-secondary hover:text-turkish-red transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted">
                    Henüz blog yazısı yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
