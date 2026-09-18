"use client";

import { useState } from "react";
import { saveYoutubeSection } from "@/app/admin/actions";
import { AdminCard, FormField, inputClass } from "@/components/admin/AdminUi";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/components/admin/FormActions";
import { extractYoutubeVideoId, youtubeEmbedUrl } from "@/lib/youtube";

export type YoutubeSection = {
  eyebrow: string;
  title: string;
  description: string;
  videoUrl: string;
  channelUrl: string;
  ctaLabel: string;
  tags: string[];
  visible: boolean;
};

export default function YoutubeForm({
  youtube,
  saved,
  error,
}: {
  youtube: YoutubeSection;
  saved: boolean;
  error: string | null;
}) {
  const [videoUrl, setVideoUrl] = useState(youtube.videoUrl);

  // Previewed live so a bad paste is obvious before saving, not after the
  // homepage has already rebuilt with a dead embed.
  const videoId = extractYoutubeVideoId(videoUrl);
  const embedUrl = youtubeEmbedUrl(videoUrl);

  return (
    <form action={saveYoutubeSection} className="space-y-6">
      <UnsavedChangesGuard />

      {saved && (
        <div className="admin-feedback admin-feedback-success" role="status">
          YouTube bölümü kaydedildi.
        </div>
      )}
      {error && (
        <div className="admin-feedback admin-feedback-error" role="alert">
          {error}
        </div>
      )}

      <AdminCard
        title="Öne çıkan video"
        description="Anasayfada oynatılacak video. Tarayıcıdan kopyaladığınız adresi olduğu gibi yapıştırabilirsiniz."
      >
        <label className="admin-toggle-row">
          <input type="checkbox" name="visible" defaultChecked={youtube.visible} />
          <span>
            <strong>Bölüm yayında</strong>
            <span className="admin-field-hint">
              Kapatırsanız bölüm anasayfadan kaldırılır; metinler burada saklı kalır.
            </span>
          </span>
        </label>

        <FormField
          label="Video adresi"
          hint="Örnek: https://www.youtube.com/watch?v=yr5MlusL0jE — youtu.be ve Shorts bağlantıları da kabul edilir."
          error={
            videoUrl && !videoId
              ? "Bu adreste bir YouTube video kimliği bulunamadı."
              : undefined
          }
        >
          <input
            name="videoUrl"
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className={inputClass}
          />
        </FormField>

        {embedUrl && (
          <div className="mt-4">
            <p className="admin-field-hint mb-2">Önizleme</p>
            <div className="aspect-video w-full max-w-[520px] overflow-hidden rounded-md border border-[color:var(--admin-line,#dbe4ee)]">
              <iframe
                src={embedUrl}
                title="Video önizleme"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        )}
      </AdminCard>

      <AdminCard
        title="Bölüm metinleri"
        description="Videonun yanında görünen başlık, açıklama ve etiketler."
      >
        <div className="admin-settings-grid">
          <FormField label="Üst etiket">
            <input name="eyebrow" defaultValue={youtube.eyebrow} className={inputClass} />
          </FormField>
          <FormField label="Başlık">
            <input name="title" defaultValue={youtube.title} className={inputClass} />
          </FormField>
        </div>

        <FormField
          label="Açıklama"
          hint="Başlığın altında görünür. Boş bırakılırsa gizlenir."
        >
          <textarea
            name="description"
            defaultValue={youtube.description}
            rows={4}
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Etiketler"
          hint="Virgülle ayırın. Örnek: Seminer, Gençlik Etkisi, Öğrenci Organizasyonu"
        >
          <input
            name="tags"
            defaultValue={youtube.tags.join(", ")}
            className={inputClass}
          />
        </FormField>
      </AdminCard>

      <AdminCard
        title="Kanal bağlantısı"
        description="Bölümdeki takip düğmesinin gittiği adres. Boş bırakılırsa düğme gizlenir."
      >
        <div className="admin-settings-grid">
          <FormField
            label="Kanal adresi"
            hint="Örnek: https://www.youtube.com/@ptob"
          >
            <input
              name="channelUrl"
              defaultValue={youtube.channelUrl}
              placeholder="https://www.youtube.com/@…"
              className={inputClass}
            />
          </FormField>
          <FormField label="Düğme yazısı">
            <input name="ctaLabel" defaultValue={youtube.ctaLabel} className={inputClass} />
          </FormField>
        </div>
      </AdminCard>

      <div className="admin-settings-footer sticky bottom-0 flex justify-end border-t border-[color:var(--admin-line,#dbe4ee)] bg-white p-4">
        <AdminSubmitButton>YouTube bölümünü kaydet</AdminSubmitButton>
      </div>
    </form>
  );
}
