"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import FormField from "@/components/admin/FormField";
import ImageUploadField from "@/components/admin/ImageUploadField";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

export interface DepartmentFormValues {
  name: string;
  slug: string;
  summary: string;
  icon: string;
  body: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface MemberDraft {
  name: string;
  role: string;
  photoMediaId: string | null;
  photoUrl: string | null;
}

export interface GalleryDraft {
  mediaId: string;
  url: string | null;
  caption: string;
}

interface DepartmentFormProps {
  /** POST for a new department, PUT for an existing one. */
  endpoint: string;
  method: "POST" | "PUT";
  defaultValues: Partial<DepartmentFormValues>;
  initialHeroMediaId?: string | null;
  initialHeroUrl?: string | null;
  initialMembers?: MemberDraft[];
  initialGallery?: GalleryDraft[];
  submitLabel: string;
}

function move<T>(list: T[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function DepartmentForm({
  endpoint,
  method,
  defaultValues,
  initialHeroMediaId = null,
  initialHeroUrl = null,
  initialMembers = [],
  initialGallery = [],
  submitLabel,
}: DepartmentFormProps) {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<DepartmentFormValues>({
    defaultValues: { sortOrder: 0, isPublished: true, ...defaultValues },
  });
  const bodyValue = watch("body") || "";

  const [heroMediaId, setHeroMediaId] = useState<string | null>(initialHeroMediaId);
  const [heroUrl, setHeroUrl] = useState<string | null>(initialHeroUrl);
  const [members, setMembers] = useState<MemberDraft[]>(initialMembers);
  const [gallery, setGallery] = useState<GalleryDraft[]>(initialGallery);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateMember(index: number, patch: Partial<MemberDraft>) {
    setMembers((list) => list.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  function updateGallery(index: number, patch: Partial<GalleryDraft>) {
    setGallery((list) => list.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  }

  async function onSubmit(data: DepartmentFormValues) {
    setError(null);

    // Untouched "add" rows are dropped rather than rejected; a half-filled member is a real mistake.
    const filledMembers = members.filter((m) => m.name.trim() || m.role.trim() || m.photoMediaId);
    const unnamed = filledMembers.findIndex((m) => !m.name.trim());
    if (unnamed !== -1) {
      setError(`Üye ${unnamed + 1} için isim girin ya da üyeyi kaldırın.`);
      return;
    }
    const filledGallery = gallery.filter((g) => g.mediaId);

    setSaving(true);
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sortOrder: Number.isFinite(data.sortOrder) ? data.sortOrder : 0,
          heroMediaId,
          members: filledMembers.map(({ name, role, photoMediaId }) => ({ name, role, photoMediaId })),
          gallery: filledGallery.map(({ mediaId, caption }) => ({ mediaId, caption })),
        }),
      });

      if (res.ok) {
        router.push("/admin/departments?saved=1");
        router.refresh();
        return;
      }

      const payload = await res.json().catch(() => null);
      setError(
        res.status === 409
          ? "Bu adres (slug) başka bir birimde kullanılıyor. Lütfen farklı bir slug girin."
          : (payload?.error ?? "Kaydedilemedi. Lütfen tekrar deneyin."),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-8">
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-text-primary">Genel bilgiler</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
          <FormField label="Birim adı" required>
            <input {...register("name", { required: true })} className="admin-input" />
          </FormField>
          <FormField label="Simge" hint="Emoji">
            <input {...register("icon")} placeholder="📢" className="admin-input" />
          </FormField>
        </div>

        <FormField label="Kısa açıklama" hint="Birimler sayfasındaki kartta görünür.">
          <textarea {...register("summary")} rows={3} className="admin-input" />
        </FormField>

        <FormField label="Kapak görseli" hint="Boş bırakılırsa birim sayfası görselsiz gösterilir.">
          <ImageUploadField
            value={heroMediaId}
            previewUrl={heroUrl}
            onChange={(id, url) => {
              setHeroMediaId(id);
              setHeroUrl(url);
            }}
            onClear={() => {
              setHeroMediaId(null);
              setHeroUrl(null);
            }}
          />
        </FormField>

        <FormField label="Sayfa içeriği" hint="Birimin kendi sayfasında görünür.">
          <MarkdownEditor
            value={bodyValue}
            onChange={(value) => setValue("body", value)}
            placeholder="Birimi markdown formatında anlatın..."
            minHeight="300px"
          />
        </FormField>
      </section>

      <section className="space-y-4" aria-labelledby="members-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="members-heading" className="text-lg font-bold text-text-primary">
            Birim ekibi
          </h2>
          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={() => setMembers((list) => [...list, { name: "", role: "", photoMediaId: null, photoUrl: null }])}
          >
            <Plus className="h-4 w-4" /> Üye ekle
          </button>
        </div>

        {members.length === 0 && <p className="text-sm text-text-muted">Henüz üye eklenmedi.</p>}

        <ul className="m-0 list-none space-y-4 p-0">
          {members.map((member, index) => (
            <li key={index} className="space-y-4 rounded-md border border-border-custom bg-white p-4" data-testid="member-row">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="İsim" required>
                  <input
                    value={member.name}
                    onChange={(e) => updateMember(index, { name: e.target.value })}
                    aria-label={`Üye ${index + 1} isim`}
                    className="admin-input"
                  />
                </FormField>
                <FormField label="Görev">
                  <input
                    value={member.role}
                    onChange={(e) => updateMember(index, { role: e.target.value })}
                    aria-label={`Üye ${index + 1} görev`}
                    className="admin-input"
                  />
                </FormField>
              </div>
              <ImageUploadField
                label="Fotoğraf"
                value={member.photoMediaId}
                previewUrl={member.photoUrl}
                onChange={(id, url) => updateMember(index, { photoMediaId: id, photoUrl: url })}
                onClear={() => updateMember(index, { photoMediaId: null, photoUrl: null })}
              />
              <div className="flex gap-2">
                <button type="button" aria-label="Yukarı taşı" className="admin-button admin-button-secondary" onClick={() => setMembers((l) => move(l, index, -1))}>
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Aşağı taşı" className="admin-button admin-button-secondary" onClick={() => setMembers((l) => move(l, index, 1))}>
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" className="admin-button admin-button-secondary" onClick={() => setMembers((l) => l.filter((_, i) => i !== index))}>
                  <Trash2 className="h-4 w-4" /> Üyeyi kaldır
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4" aria-labelledby="gallery-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="gallery-heading" className="text-lg font-bold text-text-primary">
            Galeri
          </h2>
          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={() => setGallery((list) => [...list, { mediaId: "", url: null, caption: "" }])}
          >
            <Plus className="h-4 w-4" /> Görsel ekle
          </button>
        </div>

        {gallery.length === 0 && <p className="text-sm text-text-muted">Henüz görsel eklenmedi.</p>}

        <ul className="m-0 list-none space-y-4 p-0">
          {gallery.map((item, index) => (
            <li key={index} className="space-y-4 rounded-md border border-border-custom bg-white p-4" data-testid="gallery-row">
              <ImageUploadField
                value={item.mediaId || null}
                previewUrl={item.url}
                onChange={(id, url) => updateGallery(index, { mediaId: id, url })}
                onClear={() => updateGallery(index, { mediaId: "", url: null })}
              />
              <FormField label="Alt yazı">
                <input
                  value={item.caption}
                  onChange={(e) => updateGallery(index, { caption: e.target.value })}
                  aria-label={`Görsel ${index + 1} alt yazı`}
                  className="admin-input"
                />
              </FormField>
              <div className="flex gap-2">
                <button type="button" aria-label="Yukarı taşı" className="admin-button admin-button-secondary" onClick={() => setGallery((l) => move(l, index, -1))}>
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Aşağı taşı" className="admin-button admin-button-secondary" onClick={() => setGallery((l) => move(l, index, 1))}>
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" className="admin-button admin-button-secondary" onClick={() => setGallery((l) => l.filter((_, i) => i !== index))}>
                  <Trash2 className="h-4 w-4" /> Görseli kaldır
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-bold text-text-primary">Yayın</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Slug" hint="Boş bırakılırsa addan otomatik oluşturulur">
            <input {...register("slug")} placeholder="otomatik-olusturulur" className="admin-input" />
          </FormField>
          <FormField label="Sıra" hint="Küçük sayı önce görünür">
            <input type="number" {...register("sortOrder", { valueAsNumber: true })} className="admin-input" />
          </FormField>
        </div>
        <label className="flex items-center gap-3 rounded-md border border-border-custom bg-white px-4 py-2.5 text-sm">
          <input type="checkbox" {...register("isPublished")} />
          Yayında (kapalıyken sitede görünmez)
        </label>
      </section>

      {error && (
        <p role="alert" className="rounded-md border border-turkish-red/30 bg-turkish-red/5 px-4 py-3 text-sm text-turkish-red">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="admin-button admin-button-primary">
          {saving ? "Kaydediliyor..." : submitLabel}
        </button>
        <Link href="/admin/departments" className="admin-button admin-button-secondary">
          İptal
        </Link>
      </div>
    </form>
  );
}
