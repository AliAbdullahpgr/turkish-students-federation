"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { saveHomeContent } from "@/app/admin/actions";
import { AdminCard, FormField, inputClass } from "@/components/admin/AdminUi";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/components/admin/FormActions";
import type { HomeField, HomeSectionSpec } from "@/db/queries/home-sections";

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
  saved,
  error,
}: {
  sections: HomeSectionSpec[];
  values: Record<string, string>;
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

      {sections.map((section) => (
        <AdminCard key={section.id} title={section.label} description={section.description}>
          {section.managedAt ? (
            <Link href={section.managedAt} className="admin-button admin-button-secondary self-start">
              Bu bölümü düzenle
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <SectionFields fields={section.fields} values={values} />
          )}
        </AdminCard>
      ))}

      <div className="admin-settings-footer sticky bottom-0 flex justify-end border-t border-[color:var(--admin-line,#dbe4ee)] bg-white p-4">
        <AdminSubmitButton>Anasayfayı kaydet</AdminSubmitButton>
      </div>
    </form>
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
