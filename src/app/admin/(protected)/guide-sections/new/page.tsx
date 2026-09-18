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
            className="admin-input"
          />
        </FormField>

        <FormField label="Üst Bölüm">
          <select
            {...register("parentId")}
            className="admin-input"
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
            className="admin-input"
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
              className="admin-input"
            />
          </FormField>
          <FormField label="Sıra">
            <input
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
              className="admin-input"
            />
          </FormField>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="admin-button admin-button-primary">
            Kaydet
          </button>
          <Link href="/admin/guide-sections" className="admin-button admin-button-secondary">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
