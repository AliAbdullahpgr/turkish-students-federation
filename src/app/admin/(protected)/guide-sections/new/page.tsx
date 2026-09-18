"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

interface FormData {
  id: string;
  parentId: string;
  title: string;
  content: string;
  level: number;
  sortOrder: number;
}

export default function NewGuideSectionPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: { level: 2, sortOrder: 0 },
  });
  const [parents, setParents] = useState<{ id: string; title: string }[]>([]);
  const contentValue = watch("content") || "";

  useEffect(() => {
    fetch("/api/admin/guide-sections")
      .then((r) => r.json())
      .then(setParents);
  }, []);

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/admin/guide-sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/guide-sections");
  }

  return (
    <div>
      <PageHeader title="Yeni Bölüm" backHref="/admin/guide-sections" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        <FormField label="Slug ID" hint="URL'de kullanılacak benzersiz tanımlayıcı">
          <input
            {...register("id")}
            placeholder="ornek-id"
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </FormField>

        <FormField label="Üst Bölüm">
          <select
            {...register("parentId")}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          >
            <option value="">Yok (üst seviye)</option>
            {parents
              .filter((p) => p.id)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
          </select>
        </FormField>

        <FormField label="Başlık" required>
          <input
            {...register("title", { required: true })}
            className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
          />
        </FormField>

        <FormField label="İçerik">
          <MarkdownEditor
            value={contentValue}
            onChange={(v) => setValue("content", v)}
            placeholder="Bölüm içeriğini markdown formatında yazın..."
            minHeight="400px"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Seviye" hint="1=en üst, 2=alt başlık, 3=içerik">
            <input
              type="number"
              {...register("level", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            />
          </FormField>
          <FormField label="Sıra">
            <input
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            />
          </FormField>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">
            Kaydet
          </button>
          <Link href="/admin/guide-sections" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
