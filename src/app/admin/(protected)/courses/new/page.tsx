"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormField from "@/components/admin/FormField";
import ImageUploadField from "@/components/admin/ImageUploadField";
import PageHeader from "@/components/admin/PageHeader";

interface FormData {
  title: string;
  instructor: string;
  description: string;
  href: string;
}

export default function NewCoursePage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { href: "#" },
  });
  const [thumbnailMediaId, setThumbnailMediaId] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, thumbnailMediaId }),
    });

    if (res.ok) {
      router.push("/admin/courses");
    }
  }

  return (
    <div>
      <PageHeader title="Yeni Kurs" backHref="/admin/courses" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
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
            className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </FormField>

        <FormField label="Egitmen">
          <input
            {...register("instructor")}
            className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </FormField>

        <FormField label="Aciklama">
          <textarea
            {...register("description")}
            rows={3}
            className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </FormField>

        <FormField label="Link">
          <input
            {...register("href")}
            className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </FormField>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Kaydet
          </button>
          <Link
            href="/admin/courses"
            className="rounded-md border border-border-custom px-6 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface"
          >
            Iptal
          </Link>
        </div>
      </form>
    </div>
  );
}
