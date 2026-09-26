"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AdminCard,
  AdminPageHeader,
  FormField,
  LoadingSkeleton,
  SaveState,
  inputClass,
} from "@/components/admin/AdminUi";

/**
 * Site-wide settings only.
 *
 * The `home_*` keys used to live here too, which meant this form and the new
 * `/admin/home` screen would both write them and the last save would win. The
 * homepage now owns its own fields; `home_eyebrow` and `home_secondary_cta`
 * were dropped outright because nothing on the site has ever rendered them.
 *
 * The two descriptions are plain text, not markdown: they are only ever used
 * as the pages' `<meta name="description">`, where markdown syntax would show
 * up verbatim in search results.
 */
type Field = { key: string; label: string; hint?: string; long?: boolean };

const GROUPS: { title: string; description: string; fields: Field[] }[] = [
  {
    title: "Kurum kimliği",
    description: "Sitenin adı ve arama motorlarında görünen tanıtım cümlesi.",
    fields: [
      { key: "site_name", label: "Site adı" },
      { key: "site_short_name", label: "Kısa ad", hint: "Örn. PTÖB" },
      {
        key: "site_description",
        label: "Site açıklaması",
        hint: "Hakkımızda sayfasının arama sonucu açıklaması. 160 karakteri geçmemesi önerilir.",
        long: true,
      },
    ],
  },
  {
    title: "Pakistan rehberi",
    description: "Rehberin adı, adresi ve anasayfanın arama sonucu açıklaması.",
    fields: [
      { key: "guide_name", label: "Rehber adı", hint: "Anasayfa sekme başlığında da kullanılır." },
      { key: "guide_href", label: "Rehber bağlantısı", hint: "Örn. /pakistan-rehberi/" },
      {
        key: "guide_description",
        label: "Rehber açıklaması",
        hint: "Anasayfanın arama sonucu açıklaması. 160 karakteri geçmemesi önerilir.",
        long: true,
      },
    ],
  },
  {
    title: "Bağlantılar",
    description: "Sitenin farklı yerlerindeki düğmelerin gittiği adresler.",
    fields: [{ key: "join_href", label: "Katılım bağlantısı", hint: "“Bize Katıl” düğmesinin adresi. Örn. /join-tsf/" }],
  },
];

type LoadState = "loading" | "ready" | "error";

export default function SiteSettingsPage() {
  const { register, handleSubmit, reset, watch, formState } = useForm<Record<string, string>>();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((data) => {
        reset(data);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, [reset]);

  async function onSubmit(data: Record<string, string>) {
    setSaveState("saving");
    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      // This used to report success without looking at the response, so a
      // rejected save still said "Kaydedildi".
      if (!response.ok) throw new Error(String(response.status));
      reset(data);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Genel site ayarları"
        description="Site geneli bilgiler. Anasayfadaki bölüm başlıkları ve metinleri Anasayfa bölümleri sayfasından düzenlenir."
        action={
          <Link href="/admin/home" className="admin-button admin-button-secondary">
            Anasayfa bölümleri
          </Link>
        }
      />

      {loadState === "loading" && (
        <AdminCard>
          <div className="grid gap-4" role="status" aria-label="Ayarlar yükleniyor">
            <LoadingSkeleton className="h-10 w-full" />
            <LoadingSkeleton className="h-10 w-full" />
            <LoadingSkeleton className="h-24 w-full" />
          </div>
        </AdminCard>
      )}

      {loadState === "error" && (
        <div className="admin-feedback admin-feedback-error" role="alert">
          Ayarlar yüklenemedi. Sayfayı yenileyip tekrar deneyin.
        </div>
      )}

      {loadState === "ready" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {GROUPS.map((group) => (
            <AdminCard key={group.title} title={group.title} description={group.description}>
              {group.fields.map((field) =>
                field.long ? (
                  <FormField
                    key={field.key}
                    label={`${field.label} (${(watch(field.key) ?? "").length} karakter)`}
                    hint={field.hint}
                  >
                    <textarea {...register(field.key)} rows={3} className={inputClass} />
                  </FormField>
                ) : (
                  <FormField key={field.key} label={field.label} hint={field.hint}>
                    <input {...register(field.key)} className={inputClass} />
                  </FormField>
                ),
              )}
            </AdminCard>
          ))}

          <div className="admin-settings-footer sticky bottom-0 flex items-center justify-end gap-4 border-t border-[color:var(--admin-line,#dbe4ee)] bg-white p-4">
            <SaveState state={formState.isDirty && saveState === "saved" ? "idle" : saveState} />
            <button
              type="submit"
              className="admin-button admin-button-primary"
              disabled={saveState === "saving"}
            >
              Ayarları kaydet
            </button>
          </div>
        </form>
      )}
    </>
  );
}
