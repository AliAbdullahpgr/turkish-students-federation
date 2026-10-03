"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import { FormError, useAdminSubmit } from "@/components/admin/useAdminSubmit";

interface FormData {
  label: string;
  href: string;
  parentId: string;
  sortOrder: number;
}

export default function NewNavigationItemPage() {
  const { error, saving, submit } = useAdminSubmit("/admin/navigation");
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { sortOrder: 0 } });
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/navigation")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  async function onSubmit(data: FormData) {
    await submit("/api/admin/navigation", "POST", data);
  }

  return (
    <div>
      <PageHeader title="Yeni Navigasyon Linki" backHref="/admin/navigation" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        <FormError message={error} />
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

        <FormField label="Üst Link" hint="Dropdown menü oluşturmak için seçin">
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

        <FormField label="Sıra">
          <input
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
            className="admin-input"
          />
        </FormField>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="admin-button admin-button-primary">
            Kaydet
          </button>
          <Link href="/admin/navigation" className="admin-button admin-button-secondary">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
