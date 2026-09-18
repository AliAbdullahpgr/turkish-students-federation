"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";

interface FormData {
  label: string;
  href: string;
  parentId: string;
  sortOrder: number;
  isVisible: boolean;
}

export default function EditNavigationItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/navigation")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.filter((i: { id: string }) => i.id !== id));
      });
    fetch(`/api/admin/navigation/${id}`)
      .then((r) => r.json())
      .then((data) => {
        reset(data);
        setLoading(false);
      });
  }, [id, reset]);

  async function onSubmit(data: FormData) {
    const res = await fetch(`/api/admin/navigation/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/navigation");
  }

  if (loading) return <p className="text-text-muted">Yükleniyor...</p>;

  return (
    <div>
      <PageHeader title="Link Düzenle" backHref="/admin/navigation" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        <FormField label="Etiket" required>
          <input
            {...register("label", { required: true })}
            className="admin-input"
          />
        </FormField>

        <FormField label="Link" required>
          <input
            {...register("href", { required: true })}
            className="admin-input"
          />
        </FormField>

        <FormField label="Üst Link" hint="Dropdown menü için seçin">
          <select
            {...register("parentId")}
            className="admin-input"
          >
            <option value="">Yok (ana link)</option>
            {items
              .filter((i) => i.id)
              .map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
          </select>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Sıra">
            <input
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
              className="admin-input"
            />
          </FormField>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" {...register("isVisible")} id="isVisible" />
            <label htmlFor="isVisible" className="text-sm text-text-secondary">Görünür</label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="admin-button admin-button-primary">
            Güncelle
          </button>
          <Link href="/admin/navigation" className="admin-button admin-button-secondary">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
