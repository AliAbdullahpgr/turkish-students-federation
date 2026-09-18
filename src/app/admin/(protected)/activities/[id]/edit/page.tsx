"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";

interface FormData {
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
}

const ICON_OPTIONS = [
  "Monitor", "Users", "BookOpen", "Trophy", "Shield", "Heart", "Music", "Camera",
  "Globe", "Zap", "Star", "Sun", "Moon", "Cloud", "Anchor", "Bell",
];

export default function EditActivityPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    fetch(`/api/admin/activities/${id}`)
      .then((r) => r.json())
      .then((data) => {
        reset(data);
        setLoading(false);
      });
  }, [id, reset]);

  async function onSubmit(data: FormData) {
    const res = await fetch(`/api/admin/activities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/activities");
  }

  if (loading) return <p className="text-text-muted">Yükleniyor...</p>;

  return (
    <div>
      <PageHeader title="Aktivite Düzenle" backHref="/admin/activities" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        <FormField label="Başlık" required>
          <input
            {...register("title", { required: true })}
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

        <FormField label="İkon">
          <select
            {...register("icon")}
            className="admin-input"
          >
            {ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Sıra">
          <input
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
            className="admin-input"
          />
        </FormField>

        <div className="flex gap-3">
          <button type="submit" className="admin-button admin-button-primary">
            Güncelle
          </button>
          <Link href="/admin/activities" className="admin-button admin-button-secondary">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
