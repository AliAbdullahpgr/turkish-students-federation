"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const SETTING_FIELDS = [
  { key: "site_name", label: "Site Adı" },
  { key: "site_short_name", label: "Kısa Ad" },
  { key: "guide_name", label: "Rehber Adı" },
  { key: "guide_href", label: "Rehber Linki" },
  { key: "join_href", label: "Katılım Linki" },
  { key: "site_description", label: "Site Açıklaması" },
  { key: "guide_description", label: "Rehber Açıklaması" },
  { key: "home_eyebrow", label: "Home - Üst Etiket" },
  { key: "home_title_top", label: "Home - Başlık Üst" },
  { key: "home_title_bottom", label: "Home - Başlık Alt" },
  { key: "home_summary", label: "Home - Özet" },
  { key: "home_primary_cta", label: "Home - Buton 1" },
  { key: "home_secondary_cta", label: "Home - Buton 2" },
  { key: "home_about_intro", label: "Home - Hakkımızda Metni" },
];

export default function SiteSettingsPage() {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((r) => r.json())
      .then((data) => { reset(data); setLoading(false); });
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

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Site Ayarları</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        {SETTING_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-text-secondary mb-1">{field.label}</label>
            <input {...register(field.key)} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">Kaydet</button>
          {saved && <span className="text-accent text-sm font-medium">✅ Kaydedildi!</span>}
        </div>
      </form>
    </div>
  );
}
