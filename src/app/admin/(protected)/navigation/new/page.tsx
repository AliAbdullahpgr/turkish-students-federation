"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";

interface FormData {
  label: string;
  href: string;
  parentId: string;
  sortOrder: number;
}

export default function NewNavigationItemPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { sortOrder: 0 } });
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/navigation")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/admin/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/navigation");
  }

  return (
    <div>
      <PageHeader title="Yeni Navigasyon Linki" backHref="/admin/navigation" />

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
          <button type="submit" className="admin-button admin-button-primary">
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
