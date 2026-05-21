"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BlogPostForm {
  title: string;
  excerpt: string;
  body: string;
  slug: string;
  category: string;
  author: string;
  thumbnailMediaId: string;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<BlogPostForm>();

  useEffect(() => {
    fetch(`/api/admin/blog-posts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        reset(data);
        setLoading(false);
      });
  }, [id, reset]);

  async function onSubmit(data: BlogPostForm) {
    const res = await fetch(`/api/admin/blog-posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin/blog-posts");
    }
  }

  if (loading) return <p className="text-text-muted">Yükleniyor...</p>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/blog-posts" className="text-text-secondary hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Blog Yazısını Düzenle</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Başlık</label>
          <input
            {...register("title", { required: true })}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Özet</label>
          <textarea
            {...register("excerpt")}
            rows={3}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">İçerik</label>
          <textarea
            {...register("body")}
            rows={8}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Slug</label>
            <input
              {...register("slug")}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Kategori</label>
            <input
              {...register("category")}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Yazar</label>
          <input
            {...register("author")}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Güncelle
          </button>
          <Link
            href="/admin/blog-posts"
            className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface transition-colors"
          >
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
