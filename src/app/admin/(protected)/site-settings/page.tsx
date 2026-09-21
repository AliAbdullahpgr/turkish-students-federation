"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormField from "@/components/admin/FormField";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

/**
 * Site-wide settings only.
 *
 * The `home_*` keys used to live here too, which meant this form and the new
 * `/admin/home` screen would both write them and the last save would win. The
 * homepage now owns its own fields; `home_eyebrow` and `home_secondary_cta`
 * were dropped outright because nothing on the site has ever rendered them.
 */
const SETTING_FIELDS = [
  { key: "site_name", label: "Site Adı", short: true },
  { key: "site_short_name", label: "Kısa Ad", short: true },
  { key: "guide_name", label: "Rehber Adı", short: true },
  { key: "guide_href", label: "Rehber Linki", short: true },
  { key: "join_href", label: "Katılım Linki", short: true },
  { key: "site_description", label: "Site Açıklaması", short: false },
  { key: "guide_description", label: "Rehber Açıklaması", short: false },
];

export default function SiteSettingsPage() {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, watch, setValue, reset } = useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((r) => r.json())
      .then((data) => {
        reset(data);
        setLoading(false);
      });
  }, [reset]);

  async function onSubmit(data: Record<string, string>) {
    await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <p className="text-text-muted">Yükleniyor...</p>;

  const watchedValues = watch();

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Genel site ayarları</h1>
      <p className="text-text-muted mb-6 text-sm">
        Site geneli bilgiler. Anasayfadaki bölüm başlıkları ve metinleri için{" "}
        <a href="/admin/home" className="font-semibold underline">Anasayfa bölümleri</a> sayfasını kullanın.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        {SETTING_FIELDS.map((field) =>
          field.short ? (
            <FormField key={field.key} label={field.label}>
              <input
                {...register(field.key)}
                className="admin-input"
              />
            </FormField>
          ) : (
            <FormField key={field.key} label={field.label}>
              <MarkdownEditor
                value={(watchedValues[field.key] as string) || ""}
                onChange={(v) => setValue(field.key, v)}
                minHeight="200px"
                placeholder={`${field.label} için markdown içeriği yazın...`}
              />
            </FormField>
          )
        )}
        <div className="flex items-center gap-3">
          <button type="submit" className="admin-button admin-button-primary">
            Kaydet
          </button>
          {saved && <span className="text-accent text-sm font-medium animate-fade-in">✅ Kaydedildi!</span>}
        </div>
      </form>
    </div>
  );
}
