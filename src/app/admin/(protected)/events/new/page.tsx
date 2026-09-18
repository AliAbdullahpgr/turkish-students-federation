"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormField from "@/components/admin/FormField";
import ImageUploadField from "@/components/admin/ImageUploadField";
import PageHeader from "@/components/admin/PageHeader";

interface EventForm {
  title: string;
  category: string;
  status: "upcoming" | "recent";
  date: string;
  location: string;
}

export default function NewEventPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<EventForm>({
    defaultValues: { status: "upcoming" },
  });
  const [posterMediaId, setPosterMediaId] = useState<string | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(null);

  async function onSubmit(data: EventForm) {
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, posterMediaId }),
    });

    if (res.ok) {
      router.push("/admin/events");
    }
  }

  return (
    <div>
      <PageHeader title="Yeni Etkinlik" backHref="/admin/events" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <FormField label="Afis Gorseli">
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

        <FormField label="Baslik" required>
          <input
            {...register("title", { required: true })}
            className="admin-input"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Kategori">
            <input
              {...register("category")}
              className="admin-input"
            />
          </FormField>
          <FormField label="Durum">
            <select
              {...register("status")}
              className="admin-input"
            >
              <option value="upcoming">Yaklasan</option>
              <option value="recent">Gecmis</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Tarih">
            <input
              {...register("date")}
              className="admin-input"
            />
          </FormField>
          <FormField label="Konum">
            <input
              {...register("location")}
              className="admin-input"
            />
          </FormField>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="admin-button admin-button-primary"
          >
            Kaydet
          </button>
          <Link
            href="/admin/events"
            className="admin-button admin-button-secondary"
          >
            Iptal
          </Link>
        </div>
      </form>
    </div>
  );
}
