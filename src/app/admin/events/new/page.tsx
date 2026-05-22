"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface EventForm {
  title: string;
  category: string;
  status: "upcoming" | "recent";
  date: string;
  location: string;
}

export default function NewEventPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<EventForm>({ defaultValues: { status: "upcoming" } });
  const [posterMediaId, setPosterMediaId] = useState<string | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(null);

  async function onSubmit(data: EventForm) {
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, posterMediaId }),
    });
    if (res.ok) router.push("/admin/events");
  }

  return (
    <div>
      <PageHeader title="Yeni Etkinlik" backHref="/admin/events" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <FormField label="Poster">
          <ImageUploadField
            value={posterMediaId}
            previewUrl={posterPreviewUrl}
            onChange={(id, url) => {
              setPosterMediaId(id);
              setPosterPreviewUrl(url);
            }}
            onClear={() => {
              setPosterMediaId(null);
              setPosterPreviewUrl(null);
            }}
          />
        </FormField>

        <FormField label="Başlık" required>
          <input
            {...register("title", { required: true })}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Kategori">
            <input
              {...register("category")}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            />
          </FormField>
          <FormField label="Durum">
            <select
              {...register("status")}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            >
              <option value="upcoming">Yaklaşan</option>
              <option value="recent">Geçmiş</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Tarih">
            <input
              {...register("date")}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            />
          </FormField>
          <FormField label="Konum">
            <input
              {...register("location")}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            />
          </FormField>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">
            Kaydet
          </button>
          <Link href="/admin/events" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
