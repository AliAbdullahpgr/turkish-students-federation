"use client";

import { useRouter } from "next/navigation";
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

export default function NewActivityPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { icon: "Monitor", sortOrder: 0 },
  });

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/admin/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/activities");
  }

  return (
    <div>
      <PageHeader title="Yeni Aktivite" backHref="/admin/activities" />

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
            Kaydet
          </button>
          <Link href="/admin/activities" className="admin-button admin-button-secondary">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
