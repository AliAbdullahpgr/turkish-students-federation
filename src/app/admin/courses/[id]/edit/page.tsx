"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";

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

  useEffect(() => {
    fetch(`/api/admin/courses/${id}`)
      .then((r) => r.json())
      .then((data) => {
        reset(data);
        setLoading(false);
      });
  }, [id, reset]);

  async function onSubmit(data: FormData) {
    const res = await fetch(`/api/admin/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/courses");
  }

  if (loading) return <p className="text-text-muted">Yükleniyor...</p>;

  return (
    <div>
      <PageHeader title="Kurs Düzenle" backHref="/admin/courses" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <FormField label="Başlık" required>
          <input
            {...register("title", { required: true })}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </FormField>

        <FormField label="Eğitmen">
          <input
            {...register("instructor")}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </FormField>

        <FormField label="Açıklama">
          <textarea
            {...register("description")}
            rows={3}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </FormField>

        <FormField label="Link">
          <input
            {...register("href")}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </FormField>

        <div className="flex gap-3">
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">
            Güncelle
          </button>
          <Link href="/admin/courses" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
