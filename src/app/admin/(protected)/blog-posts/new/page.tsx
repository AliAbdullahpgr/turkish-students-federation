"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormField from "@/components/admin/FormField";
import ImageUploadField from "@/components/admin/ImageUploadField";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import PageHeader from "@/components/admin/PageHeader";

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
  const router = useRouter();
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
    const res = await fetch("/api/admin/blog-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, thumbnailMediaId }),
    });

    if (res.ok) {
      router.push("/admin/blog-posts");
    }
  }

  return (
    <div>
      <PageHeader title="Yeni Blog Yazisi" backHref="/admin/blog-posts" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        <FormField label="Kapak Gorseli">
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

        <FormField label="Baslik" required>
          <input
            {...register("title", { required: true })}
            className="admin-input"
          />
        </FormField>

        <FormField label="Ozet">
          <textarea
            {...register("excerpt")}
            rows={3}
            className="admin-input"
          />
        </FormField>

        <FormField label="Icerik">
          <MarkdownEditor
            value={bodyValue}
            onChange={(value) => setValue("body", value)}
            placeholder="Blog icerigini markdown formatinda yazin..."
            minHeight="400px"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Slug" hint="Bos birakilirsa otomatik olusturulur">
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
          <FormField label="Yayin Tarihi">
            <input
              type="date"
              {...register("publishedAt")}
              className="admin-input"
            />
          </FormField>
          <label className="flex items-center gap-3 self-end rounded-md border border-border-custom bg-white px-4 py-2.5 text-sm">
            <input type="checkbox" {...register("isFeatured")} />
            Ana sayfada one cikar
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="admin-button admin-button-primary"
          >
            Kaydet
          </button>
          <Link
            href="/admin/blog-posts"
            className="admin-button admin-button-secondary"
          >
            Iptal
          </Link>
        </div>
      </form>
    </div>
  );
}
