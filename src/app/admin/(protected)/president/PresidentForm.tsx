"use client";

import Image from "next/image";
import { useState } from "react";
import { savePresidentSection } from "@/app/admin/actions";
import { AdminCard, FormField, inputClass } from "@/components/admin/AdminUi";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/components/admin/FormActions";
import ImagePicker from "@/components/admin/ImagePicker";

export type PresidentSection = {
  eyebrow: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  imageAlt: string;
  visible: boolean;
};

export default function PresidentForm({
  president,
  saved,
  error,
}: {
  president: PresidentSection;
  saved: boolean;
  error: string | null;
}) {
  const [imageUrl, setImageUrl] = useState(president.imageUrl);

  return (
    <form action={savePresidentSection} className="space-y-6">
      <UnsavedChangesGuard />

      {saved && (
        <div className="admin-feedback admin-feedback-success" role="status">
          Başkan bölümü kaydedildi.
        </div>
      )}
      {error && (
        <div className="admin-feedback admin-feedback-error" role="alert">
          {error}
        </div>
      )}

      <AdminCard
        title="Başkan bilgileri"
        description="Bu alanlar anasayfadaki başkan kartında görünür."
      >
        <label className="admin-toggle-row">
          <input type="checkbox" name="visible" defaultChecked={president.visible} />
          <span>
            <strong>Bölüm yayında</strong>
            <span className="admin-field-hint">
              Kapatırsanız bölüm anasayfadan kaldırılır; metinler burada saklı kalır.
            </span>
          </span>
        </label>

        <div className="admin-settings-grid">
          <FormField label="Üst etiket" hint="Başlığın üzerindeki küçük yazı.">
            <input name="eyebrow" defaultValue={president.eyebrow} className={inputClass} />
          </FormField>
          <FormField label="Başkanın adı" required>
            <input name="name" defaultValue={president.name} required className={inputClass} />
          </FormField>
          <FormField label="Görev veya unvan" required>
            <input name="role" defaultValue={president.role} required className={inputClass} />
          </FormField>
        </div>

        <FormField
          label="Mesaj"
          hint="Başkanın kısa özgeçmişi veya mesajı. Boş bırakılırsa bu paragraf gizlenir."
        >
          <textarea
            name="bio"
            defaultValue={president.bio}
            rows={7}
            className={inputClass}
          />
        </FormField>
      </AdminCard>

      <AdminCard
        title="Fotoğraf"
        description="Yeni bir fotoğraf yükleyin veya mevcut adresi elle düzenleyin."
      >
        {imageUrl && (
          <div className="mb-4">
            {/*
              Unoptimized: the source is either a Cloudinary URL or a path under
              /public, and this preview is for one editor on one screen — running
              it through the optimizer would cache a variant nobody else requests.
            */}
            <Image
              src={imageUrl}
              alt="Seçili başkan fotoğrafı"
              width={160}
              height={200}
              unoptimized
              className="h-[200px] w-[160px] rounded-md border border-[color:var(--admin-line,#dbe4ee)] object-cover object-top"
            />
          </div>
        )}

        <ImagePicker
          value={null}
          previewUrl={null}
          onChange={(_mediaId, secureUrl) => setImageUrl(secureUrl)}
          onClear={() => setImageUrl("")}
        />

        <input type="hidden" name="imageUrl" value={imageUrl} />

        <div className="admin-settings-grid">
          <FormField
            label="Fotoğraf adresi"
            hint="Yükleme yaptığınızda otomatik dolar. `/image/…` veya `https://…` olmalıdır."
          >
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="/image/leader.png"
              className={inputClass}
            />
          </FormField>
          <FormField
            label="Alternatif metin"
            hint="Görme engelli ziyaretçiler ve görsel yüklenmediğinde kullanılır."
          >
            <input name="imageAlt" defaultValue={president.imageAlt} className={inputClass} />
          </FormField>
        </div>
      </AdminCard>

      <div className="admin-settings-footer sticky bottom-0 flex justify-end border-t border-[color:var(--admin-line,#dbe4ee)] bg-white p-4">
        <AdminSubmitButton>Başkan bölümünü kaydet</AdminSubmitButton>
      </div>
    </form>
  );
}
