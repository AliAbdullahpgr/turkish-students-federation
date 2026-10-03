"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import FormField from "@/components/admin/FormField";
import ImageUploadField from "@/components/admin/ImageUploadField";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import PageHeader from "@/components/admin/PageHeader";
import { FormError, useAdminSubmit } from "@/components/admin/useAdminSubmit";

interface BlogPostForm {
  title: string;
  excerpt: string;
  body: string;
  slug: string;
  category: string;
  author: string;
  publishedAt: string;
  isFeatured: boolean;
}

export default function NewBlogPostPage() {
  const { error, saving, submit } = useAdminSubmit("/admin/blog-posts");
  const { register, handleSubmit, watch, setValue } = useForm<BlogPostForm>({
    defaultValues: {
      category: "Blog",
      publishedAt: new Date().toISOString().slice(0, 10),
      isFeatured: false,
    },
  });
  const bodyValue = watch("body") || "";
  const [thumbnailMediaId, setThumbnailMediaId] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  async function onSubmit(data: BlogPostForm) {
    await submit("/api/admin/blog-posts", "POST", { ...data, thumbnailMediaId });
  }

  return (
    <div>
      <PageHeader title="Yeni Blog Yazısı" backHref="/admin/blog-posts" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        <FormError message={error} />
        <FormField label="Kapak Görseli">
          <ImageUploadField
            value={thumbnailMediaId}
            previewUrl={thumbnailPreviewUrl}
            onChange={(id, url) => {
              setThumbnailMediaId(id);
              setThumbnailPreviewUrl(url);
            }}
            onClear={() => {
              setThumbnailMediaId(null);
              setThumbnailPreviewUrl(null);
            }}
          />
        </FormField>

        <FormField label="Başlık" required>
          <input
            {...register("title", { required: true })}
            className="admin-input"
          />
        </FormField>

        <FormField label="Özet">
          <textarea
            {...register("excerpt")}
            rows={3}
            className="admin-input"
          />
        </FormField>

        <FormField label="İçerik">
          <MarkdownEditor
            value={bodyValue}
            onChange={(value) => setValue("body", value)}
            placeholder="Blog içeriğini markdown formatında yazın..."
            minHeight="400px"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Slug" hint="Boş bırakılırsa otomatik oluşturulur">
            <input
              {...register("slug")}
              placeholder="otomatik-olusturulur"
              className="admin-input"
            />
          </FormField>

          <FormField label="Kategori">
            <input
              {...register("category")}
              className="admin-input"
            />
          </FormField>
        </div>

        <FormField label="Yazar">
          <input
            {...register("author")}
            className="admin-input"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Yayın Tarihi">
            <input
              type="date"
              {...register("publishedAt")}
              className="admin-input"
            />
          </FormField>
          <label className="flex items-center gap-3 self-end rounded-md border border-border-custom bg-white px-4 py-2.5 text-sm">
            <input type="checkbox" {...register("isFeatured")} />
            Anasayfada öne çıkar
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="admin-button admin-button-primary"
          >
            Kaydet
          </button>
          <Link
            href="/admin/blog-posts"
            className="admin-button admin-button-secondary"
          >
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
