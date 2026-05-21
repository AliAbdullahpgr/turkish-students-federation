"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

interface BlogPostForm {
  title: string;
  excerpt: string;
  body: string;
  slug: string;
  category: string;
  author: string;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, watch, setValue, reset } = useForm<BlogPostForm>();
  const bodyValue = watch("body") || "";

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
    if (res.ok) router.push("/admin/blog-posts");
  }

  if (loading) return <p className="text-text-muted">Yükleniyor...</p>;

  return (
    <div>
      <PageHeader title="Blog Yazısını Düzenle" backHref="/admin/blog-posts" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        <FormField label="Başlık" required>
          <input
            {...register("title", { required: true })}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </FormField>

        <FormField label="Özet">
          <textarea
            {...register("excerpt")}
            rows={3}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </FormField>

        <FormField label="İçerik">
          <MarkdownEditor
            value={bodyValue}
            onChange={(v) => setValue("body", v)}
            placeholder="Blog içeriğini markdown formatında yazın..."
            minHeight="400px"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Slug">
            <input
              {...register("slug")}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            />
          </FormField>
          <FormField label="Kategori">
            <input
              {...register("category")}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            />
          </FormField>
        </div>

        <FormField label="Yazar">
          <input
            {...register("author")}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </FormField>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">
            Güncelle
          </button>
          <Link href="/admin/blog-posts" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
