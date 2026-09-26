"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { saveHomeContent } from "@/app/admin/actions";
import { AdminCard, FormField, StatusBadge, inputClass } from "@/components/admin/AdminUi";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/components/admin/FormActions";
import ImagePicker from "@/components/admin/ImagePicker";
import type { HomeField, HomeSectionSpec } from "@/db/queries/home-sections";
import { isValidLinkTarget } from "@/lib/public-routes";

/**
 * One form for the whole homepage, one card per band, in the order the bands
 * appear on the site. The editor scrolls the page in the same sequence a
 * visitor scrolls it, which is what makes "which box changes that heading?"
 * answerable without a guess.
 *
 * Every input is rendered from the shared spec, so the form can never drift
 * out of step with what the save action accepts.
 */
export default function HomeContentForm({
  sections,
  values,
  managedVisibility,
  saved,
  error,
}: {
  sections: HomeSectionSpec[];
  values: Record<string, string>;
  /** Saved visibility of the sections edited on their own screens, keyed by section id. */
  managedVisibility: Record<string, boolean>;
  saved: boolean;
  error: string | null;
}) {
  return (
    <form action={saveHomeContent} className="space-y-6">
      <UnsavedChangesGuard />

      {saved && (
        <div className="admin-feedback admin-feedback-success" role="status">
          Anasayfa kaydedildi. Değişiklikler siteye yansıdı.
        </div>
      )}
      {error && (
        <div className="admin-feedback admin-feedback-error" role="alert">
          {error}
        </div>
      )}

      <SectionOverview sections={sections} values={values} managedVisibility={managedVisibility} />

      {sections.map((section, index) => (
        <div key={section.id} id={`home-section-${section.id}`} className="admin-home-anchor">
          <AdminCard
            title={`${index + 1}. ${section.label}`}
            description={section.description}
            action={<StatusBadge state={sectionState(section, values, managedVisibility)} />}
          >
            {section.managedAt ? (
              <Link href={section.managedAt} className="admin-button admin-button-secondary self-start">
                Bu bölümü düzenle
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            ) : (
              <SectionFields fields={section.fields} values={values} />
            )}
          </AdminCard>
        </div>
      ))}

      <div className="admin-settings-footer sticky bottom-0 flex justify-end border-t border-[color:var(--admin-line,#dbe4ee)] bg-white p-4">
        <AdminSubmitButton>Anasayfayı kaydet</AdminSubmitButton>
      </div>
    </form>
  );
}

/**
 * What the site shows right now, per section. Read from the saved values, not
 * the unsaved form, so the badge answers "is it on the homepage?" truthfully.
 * A section with no visibility switch (the hero) is always shown.
 */
function sectionState(
  section: HomeSectionSpec,
  values: Record<string, string>,
  managedVisibility: Record<string, boolean>,
) {
  if (section.managedAt) return managedVisibility[section.id] === false ? "hidden" : "published";
  const toggle = section.fields.find((field) => field.kind === "toggle");
  if (!toggle) return "published";
  return values[toggle.key] === "0" ? "hidden" : "published";
}

/**
 * The whole homepage at a glance, in site order — the same shape as the
 * homepage hub in E:/NGO. Each row jumps to its card, or to the screen that
 * owns it, so a long form is never something to scroll through blind.
 */
function SectionOverview({
  sections,
  values,
  managedVisibility,
}: {
  sections: HomeSectionSpec[];
  values: Record<string, string>;
  managedVisibility: Record<string, boolean>;
}) {
  return (
    <AdminCard
      title="Anasayfa düzeni"
      description="Bölümler ziyaretçinin gördüğü sırayla listelenir. Bir bölüme gitmek için satıra tıklayın."
    >
      <ol className="admin-home-overview">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={section.managedAt ?? `#home-section-${section.id}`}
              className="admin-home-overview__row"
            >
              <span className="admin-home-overview__index">{index + 1}</span>
              <span className="admin-home-overview__copy">
                <strong>{section.label}</strong>
                <span>{section.managedAt ? "Kendi sayfasında düzenlenir" : section.description}</span>
              </span>
              <StatusBadge state={sectionState(section, values, managedVisibility)} />
              {section.managedAt ? (
                <ArrowUpRight className="admin-home-overview__arrow" aria-hidden="true" />
              ) : (
                <ArrowDown className="admin-home-overview__arrow" aria-hidden="true" />
              )}
            </a>
          </li>
        ))}
      </ol>
    </AdminCard>
  );
}

function SectionFields({
  fields,
  values,
}: {
  fields: HomeField[];
  values: Record<string, string>;
}) {
  const toggles = fields.filter((field) => field.kind === "toggle");
  const longs = fields.filter((field) => field.kind === "long");
  const images = fields.filter((field) => field.kind === "image");
  // Short text and links share the two-column grid; long copy needs the full width.
  const shorts = fields.filter((field) => field.kind === "text" || field.kind === "href");

  return (
    <>
      {toggles.map((field) => (
        <label key={field.key} className="admin-toggle-row">
          <input type="checkbox" name={field.key} defaultChecked={values[field.key] !== "0"} />
          <span>
            <strong>{field.label}</strong>
            <span className="admin-field-hint">
              Kapatırsanız bölüm anasayfadan kaldırılır; metinler burada saklı kalır.
            </span>
          </span>
        </label>
      ))}

      {shorts.length > 0 && (
        <div className="admin-settings-grid">
          {shorts.map((field) => (
            <FormField key={field.key} label={field.label} hint={field.help}>
              <input name={field.key} defaultValue={values[field.key] ?? ""} className={inputClass} />
            </FormField>
          ))}
        </div>
      )}

      {images.map((field) => (
        <ImageField key={field.key} field={field} initial={values[field.key] ?? ""} />
      ))}

      {longs.map((field) => (
        <FormField key={field.key} label={field.label} hint={field.help}>
          <textarea
            name={field.key}
            defaultValue={values[field.key] ?? ""}
            rows={4}
            className={inputClass}
          />
        </FormField>
      ))}
    </>
  );
}

/**
 * Upload or pick from the library, with the path still editable by hand. The
 * hidden input is what the form posts, so the picker and the text box can
 * never disagree about which image gets saved.
 */
function ImageField({ field, initial }: { field: HomeField; initial: string }) {
  const [url, setUrl] = useState(initial);

  return (
    <FormField label={field.label} hint={field.help}>
      <div className="admin-image-field">
        {isValidLinkTarget(url) && (
          // Unoptimized: a one-editor preview of either a /public path or a
          // Cloudinary URL; the optimizer would only cache a variant nobody uses.
          <Image
            src={url}
            alt=""
            width={240}
            height={135}
            unoptimized
            className="admin-image-field__preview"
          />
        )}
        <div className="admin-image-field__controls">
          <ImagePicker
            value={null}
            previewUrl={null}
            onChange={(_mediaId, secureUrl) => setUrl(secureUrl)}
            onClear={() => setUrl("")}
          />
          <input
            aria-label={`${field.label} adresi`}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="/image/…"
            className={inputClass}
          />
        </div>
      </div>
      <input type="hidden" name={field.key} value={url} />
    </FormField>
  );
}
