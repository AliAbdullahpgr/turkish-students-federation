"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormField from "@/components/admin/FormField";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

const SETTING_FIELDS = [
  { key: "site_name", label: "Site Adı", short: true },
  { key: "site_short_name", label: "Kısa Ad", short: true },
  { key: "guide_name", label: "Rehber Adı", short: true },
  { key: "guide_href", label: "Rehber Linki", short: true },
  { key: "join_href", label: "Katılım Linki", short: true },
  { key: "site_description", label: "Site Açıklaması", short: false },
  { key: "guide_description", label: "Rehber Açıklaması", short: false },
  { key: "home_eyebrow", label: "Home - Üst Etiket", short: true },
  { key: "home_title_top", label: "Home - Başlık Üst", short: true },
  { key: "home_title_bottom", label: "Home - Başlık Alt", short: true },
  { key: "home_summary", label: "Home - Özet", short: false },
  { key: "home_primary_cta", label: "Home - Buton 1", short: true },
  { key: "home_secondary_cta", label: "Home - Buton 2", short: true },
  { key: "home_about_intro", label: "Home - Hakkımızda Metni", short: false },
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
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Site Ayarları</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        {SETTING_FIELDS.map((field) =>
          field.short ? (
            <FormField key={field.key} label={field.label}>
              <input
                {...register(field.key)}
                className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent"
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
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">
            Kaydet
          </button>
          {saved && <span className="text-accent text-sm font-medium animate-fade-in">✅ Kaydedildi!</span>}
        </div>
      </form>
    </div>
  );
}
