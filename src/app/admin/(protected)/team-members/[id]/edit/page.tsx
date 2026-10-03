"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { FormError, useAdminSubmit } from "@/components/admin/useAdminSubmit";

interface FormData {
  name: string;
  role: string;
  bio: string;
  order: number;
  isActive: boolean;
}

export default function EditTeamMemberPage() {
  const { error, saving, submit } = useAdminSubmit("/admin/team-members");
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>();
  const bioValue = watch("bio") || "";

  const [photoMediaId, setPhotoMediaId] = useState<string | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/team-members/${id}`)
      .then((r) => r.json())
      .then((data) => {
        reset(data);
        if (data.photoMediaId) setPhotoMediaId(data.photoMediaId);
        if (data.photo) setPhotoPreviewUrl(data.photo);
        setLoading(false);
      });
  }, [id, reset]);

  async function onSubmit(data: FormData) {
    await submit(`/api/admin/team-members/${id}`, "PUT", { ...data, photoMediaId });
  }

  if (loading) return <p className="text-text-muted">Yükleniyor...</p>;

  return (
    <div>
      <PageHeader title="Üye Düzenle" backHref="/admin/team-members" />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        <FormError message={error} />
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
              className="admin-input"
            />
          </FormField>
          <FormField label="Rol" required>
            <input
              {...register("role", { required: true })}
              className="admin-input"
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
              className="admin-input"
            />
          </FormField>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" {...register("isActive")} id="isActive" />
            <label htmlFor="isActive" className="text-sm text-text-secondary">Aktif</label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="admin-button admin-button-primary">
            Güncelle
          </button>
          <Link href="/admin/team-members" className="admin-button admin-button-secondary">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}
