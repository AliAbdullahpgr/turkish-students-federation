"use client";

import { useRouter } from "next/navigation";
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

export default function NewCoursePage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { href: "#" } });

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/courses");
  }

  return (
    <div>
      <PageHeader title="Yeni Kurs" backHref="/admin/courses" />

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
            Kaydet
          </button>
          <Link href="/admin/courses" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
