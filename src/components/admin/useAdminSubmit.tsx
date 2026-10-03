"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Save handling shared by the REST-backed admin forms.
 *
 * Those forms used to do `if (res.ok) router.push(list)` and nothing else, so a
 * rejected save (a missing field, a duplicate slug, the server down) left the
 * user on an unchanged form with no sign that anything had gone wrong. This
 * reports the failure and, on success, returns to the list with `?saved=1` so
 * the list can confirm it.
 */
export function useAdminSubmit(listPath: string) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(url: string, method: "POST" | "PUT", body: unknown) {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        router.push(`${listPath}?saved=1`);
        router.refresh();
        return;
      }
      const payload = await res.json().catch(() => null);
      setError(
        res.status === 409
          ? "Bu değer (örneğin slug) başka bir kayıtta kullanılıyor. Lütfen farklı bir değer girin."
          : typeof payload?.error === "string"
            ? `Kaydedilemedi: ${payload.error}`
            : "Kaydedilemedi. Lütfen tekrar deneyin.",
      );
    } catch {
      setError("Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  return { error, saving, submit };
}

export function FormError({ message }: { message: string | null }) {
  const ref = useRef<HTMLParagraphElement>(null);

  // A long form can hide the message off-screen; bring it into view.
  useEffect(() => {
    if (message) ref.current?.scrollIntoView({ block: "nearest" });
  }, [message]);

  if (!message) return null;
  return (
    <p
      ref={ref}
      role="alert"
      className="rounded-md border border-turkish-red/30 bg-turkish-red/5 px-4 py-3 text-sm text-turkish-red"
    >
      {message}
    </p>
  );
}

/** Confirms a save on the list the form returned to (`?saved=1`). */
export function SavedNotice() {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(new URLSearchParams(window.location.search).has("saved"));
  }, []);
  if (!saved) return null;
  return (
    <p role="status" className="mb-4 rounded-md border border-border-custom bg-white px-4 py-3 text-sm text-text-primary">
      Değişiklikler kaydedildi.
    </p>
  );
}
