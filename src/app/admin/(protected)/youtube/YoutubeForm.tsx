"use client";

import { useState } from "react";
import { X } from "lucide-react";
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
        <FormField label="Başlık" hint="Boş bırakılırsa gizlenir.">
          <input name="title" defaultValue={youtube.title} className={inputClass} />
        </FormField>

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

        <TagsField initial={youtube.tags} />
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

/**
 * The tags under the video title, one removable chip each.
 *
 * This used to be a single comma-separated text box, and clearing a tag meant
 * finding it inside that string — easy to miss, which is how tags "would not
 * go away". The form still posts one comma-joined `tags` value, so the save
 * action and the stored format are unchanged.
 */
function TagsField({ initial }: { initial: string[] }) {
  const [tags, setTags] = useState(initial);
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const next = raw
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag && !tags.includes(tag));
    if (next.length) setTags([...tags, ...next]);
    setDraft("");
  }

  return (
    <FormField
      label="Etiketler"
      hint="Yazıp Enter'a basın. Bir etiketi kaldırmak için yanındaki × işaretine tıklayın. Hiç etiket yoksa bu satır sitede gösterilmez."
    >
      {tags.length > 0 && (
        <ul className="admin-tag-list" aria-label="Eklenen etiketler">
          {tags.map((tag) => (
            <li key={tag} className="admin-tag">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => setTags(tags.filter((candidate) => candidate !== tag))}
                aria-label={`${tag} etiketini kaldır`}
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
          <li>
            <button type="button" className="admin-tag-clear" onClick={() => setTags([])}>
              Tümünü kaldır
            </button>
          </li>
        </ul>
      )}
      <input
        value={draft}
        onChange={(event) => {
          const value = event.target.value;
          if (value.includes(",")) add(value);
          else setDraft(value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            // Enter would otherwise submit the whole form mid-edit.
            event.preventDefault();
            add(draft);
          } else if (event.key === "Backspace" && !draft && tags.length) {
            setTags(tags.slice(0, -1));
          }
        }}
        onBlur={() => draft && add(draft)}
        placeholder="Yeni etiket…"
        aria-label="Yeni etiket"
        className={inputClass}
      />
      <input type="hidden" name="tags" value={tags.join(", ")} />
    </FormField>
  );
}
