"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import ImageUploadField from "@/components/admin/ImageUploadField";
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
  const [thumbnailMediaId, setThumbnailMediaId] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/blog-posts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        reset(data);
        if (data.thumbnailMediaId) {
          setThumbnailMediaId(data.thumbnailMediaId);
        }
        if (data.thumbnail) {
          setThumbnailPreviewUrl(data.thumbnail);
        }
        setLoading(false);
      });
  }, [id, reset]);

  async function onSubmit(data: BlogPostForm) {
    const res = await fetch(`/api/admin/blog-posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, thumbnailMediaId }),
    });

    if (res.ok) {
      router.push("/admin/blog-posts");
    }
  }

  if (loading) {
    return <p className="text-text-muted">Yukleniyor...</p>;
  }

  return (
    <div>
      <PageHeader title="Blog Yazisini Duzenle" backHref="/admin/blog-posts" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        <FormField label="Kapak Gorseli">
          <ImageUploadField
            value={thumbnailMediaId}
            previewUrl={thumbnailPreviewUrl}
            onChange={(newId, url) => {
              setThumbnailMediaId(newId);
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
            className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </FormField>

        <FormField label="Ozet">
          <textarea
            {...register("excerpt")}
            rows={3}
            className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
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
          <FormField label="Slug">
            <input
              {...register("slug")}
              className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </FormField>
          <FormField label="Kategori">
            <input
              {...register("category")}
              className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </FormField>
        </div>

        <FormField label="Yazar">
          <input
            {...register("author")}
            className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </FormField>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Guncelle
          </button>
          <Link
            href="/admin/blog-posts"
            className="rounded-md border border-border-custom px-6 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface"
          >
            Iptal
          </Link>
        </div>
      </form>
    </div>
  );
}
