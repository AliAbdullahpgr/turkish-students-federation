"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from "lucide-react";
import { saveHeroSlides } from "@/app/admin/actions";
import { AdminCard, FormField, inputClass } from "@/components/admin/AdminUi";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/components/admin/FormActions";
import ImagePicker from "@/components/admin/ImagePicker";
import { MAX_ACTIVE_HERO_SLIDES, MAX_HERO_SLIDES, type HeroSlide } from "@/lib/hero-slides";

function blankSlide(): HeroSlide {
  return {
    id: `slide-${Math.random().toString(36).slice(2, 9)}`,
    titleTop: "",
    titleBottom: "",
    summary: "",
    ctaLabel: "",
    ctaHref: "",
    image: "",
    imageAlt: "",
    active: false,
  };
}

function move<T>(list: T[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function SliderManager({ initialSlides }: { initialSlides: HeroSlide[] }) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const activeCount = slides.filter((slide) => slide.active).length;

  function update(id: string, patch: Partial<HeroSlide>) {
    setSlides((list) => list.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)));
  }

  function remove(id: string) {
    setSlides((list) => list.filter((slide) => slide.id !== id));
    setConfirmingId(null);
  }

  function duplicate(index: number) {
    setSlides((list) => {
      const copy = { ...list[index], id: blankSlide().id, active: false };
      return [...list.slice(0, index + 1), copy, ...list.slice(index + 1)];
    });
  }

  return (
    <form action={saveHeroSlides} className="space-y-6">
      <UnsavedChangesGuard />
      <input type="hidden" name="slides" value={JSON.stringify(slides)} readOnly />

      <p className="text-sm text-text-secondary">
        {activeCount} yayında, {slides.length - activeCount} gizli. En fazla {MAX_ACTIVE_HERO_SLIDES} slayt aynı anda
        yayında olabilir; sıra aşağıdaki sıradır.
      </p>

      <ol className="m-0 list-none space-y-6 p-0">
        {slides.map((slide, index) => (
          <li key={slide.id} data-testid="slide-row">
            <AdminCard
              title={`${index + 1}. slayt${slide.active ? "" : " (gizli)"}`}
              action={
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-label={`${index + 1}. slaytı yukarı taşı`}
                    disabled={index === 0}
                    className="admin-button admin-button-secondary"
                    onClick={() => setSlides((list) => move(list, index, -1))}
                  >
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`${index + 1}. slaytı aşağı taşı`}
                    disabled={index === slides.length - 1}
                    className="admin-button admin-button-secondary"
                    onClick={() => setSlides((list) => move(list, index, 1))}
                  >
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`${index + 1}. slaytı çoğalt`}
                    disabled={slides.length >= MAX_HERO_SLIDES}
                    className="admin-button admin-button-secondary"
                    onClick={() => duplicate(index)}
                  >
                    <Copy className="size-4" aria-hidden="true" />
                  </button>
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Başlık — üst satır">
                  <input
                    className={inputClass}
                    value={slide.titleTop}
                    onChange={(e) => update(slide.id, { titleTop: e.target.value })}
                    aria-label={`${index + 1}. slayt başlık üst satır`}
                  />
                </FormField>
                <FormField label="Başlık — alt satır (vurgulu)">
                  <input
                    className={inputClass}
                    value={slide.titleBottom}
                    onChange={(e) => update(slide.id, { titleBottom: e.target.value })}
                    aria-label={`${index + 1}. slayt başlık alt satır`}
                  />
                </FormField>
              </div>

              <FormField label="Özet metin">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={slide.summary}
                  onChange={(e) => update(slide.id, { summary: e.target.value })}
                  aria-label={`${index + 1}. slayt özet`}
                />
              </FormField>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Buton yazısı" hint="Boş bırakılırsa buton gösterilmez.">
                  <input
                    className={inputClass}
                    value={slide.ctaLabel}
                    onChange={(e) => update(slide.id, { ctaLabel: e.target.value })}
                    aria-label={`${index + 1}. slayt buton yazısı`}
                  />
                </FormField>
                <FormField label="Buton bağlantısı" hint="Örn. /faaliyetler/ veya https://…">
                  <input
                    className={inputClass}
                    value={slide.ctaHref}
                    onChange={(e) => update(slide.id, { ctaHref: e.target.value })}
                    aria-label={`${index + 1}. slayt buton bağlantısı`}
                  />
                </FormField>
              </div>

              <div className="space-y-3">
                <span className="admin-field-label">Arka plan görseli</span>
                <ImagePicker
                  value={null}
                  previewUrl={slide.image || null}
                  onChange={(_id, url) => update(slide.id, { image: url })}
                  onClear={() => update(slide.id, { image: "" })}
                />
                <FormField label="Görsel adresi" hint="Yükleme yerine elle /image/… veya https://… yazabilirsiniz.">
                  <input
                    className={inputClass}
                    value={slide.image}
                    onChange={(e) => update(slide.id, { image: e.target.value })}
                    aria-label={`${index + 1}. slayt görsel adresi`}
                  />
                </FormField>
                <FormField label="Görsel açıklaması" hint="Ekran okuyucular için.">
                  <input
                    className={inputClass}
                    value={slide.imageAlt}
                    onChange={(e) => update(slide.id, { imageAlt: e.target.value })}
                    aria-label={`${index + 1}. slayt görsel açıklaması`}
                  />
                </FormField>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={slide.active}
                    onChange={(e) => update(slide.id, { active: e.target.checked })}
                    aria-label={`${index + 1}. slayt yayında`}
                  />
                  Sitede göster
                </label>

                {confirmingId === slide.id ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span>Slayt silinsin mi?</span>
                    <button type="button" className="admin-button admin-button-primary" onClick={() => remove(slide.id)}>
                      Evet, sil
                    </button>
                    <button type="button" className="admin-button admin-button-secondary" onClick={() => setConfirmingId(null)}>
                      Vazgeç
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="admin-button admin-button-secondary"
                    onClick={() => setConfirmingId(slide.id)}
                    aria-label={`${index + 1}. slaytı sil`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" /> Slaytı sil
                  </button>
                )}
              </div>
            </AdminCard>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-custom pt-4">
        <button
          type="button"
          className="admin-button admin-button-secondary"
          disabled={slides.length >= MAX_HERO_SLIDES}
          onClick={() => setSlides((list) => [...list, blankSlide()])}
        >
          <Plus className="size-4" aria-hidden="true" /> Slayt ekle
        </button>
        <AdminSubmitButton>Slaytları kaydet</AdminSubmitButton>
      </div>
    </form>
  );
}
