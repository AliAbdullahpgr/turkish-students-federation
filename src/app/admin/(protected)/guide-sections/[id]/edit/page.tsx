"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

interface GuideSection {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  level: number;
  sortOrder: number;
  isPublished: boolean;
}

interface FormData {
  title: string;
  content: string;
  parentId: string;
  level: number;
  sortOrder: number;
  isPublished: boolean;
}

export default function EditGuideSectionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<GuideSection | null>(null);
  const [parentLabel, setParentLabel] = useState<string>("");

  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: { level: 2, sortOrder: 0, isPublished: true, parentId: "" },
  });
  const contentValue = watch("content") || "";

  useEffect(() => {
    fetch(`/api/admin/guide-sections/${id}`)
      .then((r) => r.json())
      .then((data: GuideSection) => {
        setSection(data);
        setValue("title", data.title);
        setValue("content", data.content || "");
        setValue("parentId", data.parentId ?? "");
        setValue("level", data.level);
        setValue("sortOrder", data.sortOrder);
        setValue("isPublished", data.isPublished);

        if (data.parentId) {
          fetch(`/api/admin/guide-sections/${data.parentId}`)
            .then((r) => r.json())
            .then((p: GuideSection) => setParentLabel(p.title))
            .catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, [id, setValue]);

  async function onSubmit(data: FormData) {
    const res = await fetch(`/api/admin/guide-sections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        parentId: data.parentId || null,
      }),
    });
    if (res.ok) router.push("/admin/guide-sections");
  }

  if (loading) return <p className="text-text-muted">Yükleniyor...</p>;
  if (!section) return <p className="text-turkish-red">Bölüm bulunamadı.</p>;

  return (
    <div>
      <PageHeader title={`Düzenle: ${section.title}`} backHref="/admin/guide-sections" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        {parentLabel && (
          <div className="text-sm text-text-muted bg-surface rounded-md px-4 py-2 inline-block">
            Üst bölüm: <span className="font-medium text-text-secondary">{parentLabel}</span> (Seviye {section.level})
          </div>
        )}

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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" {...register("isPublished")} id="isPublished" />
            <label htmlFor="isPublished" className="text-sm text-text-secondary">Yayında</label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">
            Güncelle
          </button>
          <Link href="/admin/guide-sections" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
