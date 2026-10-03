"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import FormField from "@/components/admin/FormField";
import ImageUploadField from "@/components/admin/ImageUploadField";
import PageHeader from "@/components/admin/PageHeader";
import { FormError, useAdminSubmit } from "@/components/admin/useAdminSubmit";

interface FormData {
  title: string;
  instructor: string;
  description: string;
  href: string;
}

export default function NewCoursePage() {
  const { error, saving, submit } = useAdminSubmit("/admin/courses");
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { href: "#" },
  });
  const [thumbnailMediaId, setThumbnailMediaId] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  async function onSubmit(data: FormData) {
    await submit("/api/admin/courses", "POST", { ...data, thumbnailMediaId });
  }

  return (
    <div>
      <PageHeader title="Yeni Kurs" backHref="/admin/courses" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
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

        <FormField label="Eğitmen">
          <input
            {...register("instructor")}
            className="admin-input"
          />
        </FormField>

        <FormField label="Açıklama">
          <textarea
            {...register("description")}
            rows={3}
            className="admin-input"
          />
        </FormField>

        <FormField label="Link">
          <input
            {...register("href")}
            className="admin-input"
          />
        </FormField>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="admin-button admin-button-primary"
          >
            Kaydet
          </button>
          <Link
            href="/admin/courses"
            className="admin-button admin-button-secondary"
          >
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
