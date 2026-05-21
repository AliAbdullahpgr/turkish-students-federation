"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface FormData {
  name: string;
  role: string;
  bio: string;
  order: number;
  isActive: boolean;
}

export default function NewTeamMemberPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: { order: 0, isActive: true },
  });
  const bioValue = watch("bio") || "";

  const [photoMediaId, setPhotoMediaId] = useState<string | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/admin/team-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, photoMediaId }),
    });
    if (res.ok) router.push("/admin/team-members");
  }

  return (
    <div>
      <PageHeader title="Yeni Ekip Üyesi" backHref="/admin/team-members" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        <FormField label="Fotoğraf">
          <ImageUploadField
            value={photoMediaId}
            previewUrl={photoPreviewUrl}
            onChange={(id, url) => {
              setPhotoMediaId(id);
              setPhotoPreviewUrl(url);
            }}
            onClear={() => {
              setPhotoMediaId(null);
              setPhotoPreviewUrl(null);
            }}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="İsim" required>
            <input
              {...register("name", { required: true })}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            />
          </FormField>
          <FormField label="Rol" required>
            <input
              {...register("role", { required: true })}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            />
          </FormField>
        </div>

        <FormField label="Biyografi">
          <MarkdownEditor
            value={bioValue}
            onChange={(v) => setValue("bio", v)}
            placeholder="Üye biyografisini markdown formatında yazın..."
            minHeight="200px"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Sıra">
            <input
              type="number"
              {...register("order", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
            />
          </FormField>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" {...register("isActive")} id="isActive" />
            <label htmlFor="isActive" className="text-sm text-text-secondary">Aktif</label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">
            Kaydet
          </button>
          <Link href="/admin/team-members" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
