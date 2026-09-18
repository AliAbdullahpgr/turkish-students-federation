"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormField from "@/components/admin/FormField";
import ImageUploadField from "@/components/admin/ImageUploadField";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

export interface ActivityPostFormValues {
  title: string;
  excerpt: string;
  body: string;
  slug: string;
  category: string;
  location: string;
  happenedAt: string;
  isPublished: boolean;
}

interface ActivityPostFormProps {
  /** POST for a new activity, PUT for an existing one. */
  endpoint: string;
  method: "POST" | "PUT";
  defaultValues: Partial<ActivityPostFormValues>;
  initialThumbnailMediaId?: string | null;
  initialThumbnailUrl?: string | null;
  submitLabel: string;
}

/**
 * Shared by the new and edit screens so the two cannot drift apart — the blog
 * admin duplicates its form across both files and the fields have to be kept in
 * sync by hand.
 */
export default function ActivityPostForm({
  endpoint,
  method,
  defaultValues,
  initialThumbnailMediaId = null,
  initialThumbnailUrl = null,
  submitLabel,
}: ActivityPostFormProps) {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<ActivityPostFormValues>({
    defaultValues: {
      category: "Faaliyet",
      happenedAt: new Date().toISOString().slice(0, 10),
      isPublished: true,
      ...defaultValues,
    },
  });

  const bodyValue = watch("body") || "";
  const [thumbnailMediaId, setThumbnailMediaId] = useState<string | null>(initialThumbnailMediaId);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(initialThumbnailUrl);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: ActivityPostFormValues) {
    setError(null);
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, thumbnailMediaId }),
    });

    if (res.ok) {
      router.push("/admin/activity-posts");
      router.refresh();
      return;
    }

    const payload = await res.json().catch(() => null);
    setError(payload?.error ?? "Kaydedilemedi. Lütfen tekrar deneyin.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
      <FormField label="Kapak Görseli" hint="Boş bırakılırsa kart görselsiz gösterilir.">
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
        <input {...register("title", { required: true })} className="admin-input" />
      </FormField>

      <FormField label="Özet" hint="Kartlarda ve listede görünen kısa açıklama.">
        <textarea {...register("excerpt")} rows={3} className="admin-input" />
      </FormField>

      <FormField label="İçerik">
        <MarkdownEditor
          value={bodyValue}
          onChange={(value) => setValue("body", value)}
          placeholder="Faaliyeti markdown formatında anlatın..."
          minHeight="360px"
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Slug" hint="Boş bırakılırsa otomatik oluşturulur">
          <input {...register("slug")} placeholder="otomatik-olusturulur" className="admin-input" />
        </FormField>

        <FormField label="Kategori">
          <input {...register("category")} className="admin-input" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Yer">
          <input {...register("location")} placeholder="İslamabad" className="admin-input" />
        </FormField>

        <FormField label="Tarih">
          <input type="date" {...register("happenedAt")} className="admin-input" />
        </FormField>
      </div>

      <label className="flex items-center gap-3 rounded-md border border-border-custom bg-white px-4 py-2.5 text-sm">
        <input type="checkbox" {...register("isPublished")} />
        Yayında (kapalıyken sitede görünmez)
      </label>

      {error && (
        <p className="rounded-md border border-turkish-red/30 bg-turkish-red/5 px-4 py-3 text-sm text-turkish-red">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="admin-button admin-button-primary">
          {submitLabel}
        </button>
        <Link href="/admin/activity-posts" className="admin-button admin-button-secondary">
          İptal
        </Link>
      </div>
    </form>
  );
}
