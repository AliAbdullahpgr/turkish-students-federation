"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<EventForm>();
  const [posterMediaId, setPosterMediaId] = useState<string | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/events/${id}`)
      .then((response) => response.json())
      .then((data) => {
        reset(data);
        if (data.posterMediaId) {
          setPosterMediaId(data.posterMediaId);
        }
        if (data.posterImage) {
          setPosterPreviewUrl(data.posterImage);
        }
        setLoading(false);
      });
  }, [id, reset]);

  async function onSubmit(data: EventForm) {
    const res = await fetch(`/api/admin/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, posterMediaId }),
    });

    if (res.ok) {
      router.push("/admin/events");
    }
  }

  if (loading) {
    return <p className="text-text-muted">Yukleniyor...</p>;
  }

  return (
    <div>
      <PageHeader title="Etkinlik Duzenle" backHref="/admin/events" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        <FormField label="Afis Gorseli">
          <ImageUploadField
            value={posterMediaId}
            previewUrl={posterPreviewUrl}
            onChange={(newId, url) => {
              setPosterMediaId(newId);
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
            className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Kategori">
            <input
              {...register("category")}
              className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </FormField>
          <FormField label="Durum">
            <select
              {...register("status")}
              className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
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
              className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </FormField>
          <FormField label="Konum">
            <input
              {...register("location")}
              className="w-full rounded-md border border-border-custom bg-white px-4 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </FormField>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Guncelle
          </button>
          <Link
            href="/admin/events"
            className="rounded-md border border-border-custom px-6 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface"
          >
            Iptal
          </Link>
        </div>
      </form>
    </div>
  );
}
