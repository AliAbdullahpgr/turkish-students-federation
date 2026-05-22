"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [thumbnailMediaId, setThumbnailMediaId] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/courses/${id}`)
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

  async function onSubmit(data: FormData) {
    const res = await fetch(`/api/admin/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, thumbnailMediaId }),
    });

    if (res.ok) {
      router.push("/admin/courses");
    }
  }

  if (loading) {
    return <p className="text-text-muted">Yukleniyor...</p>;
  }

  return (
    <div>
      <PageHeader title="Kurs Duzenle" backHref="/admin/courses" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
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
            Guncelle
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
