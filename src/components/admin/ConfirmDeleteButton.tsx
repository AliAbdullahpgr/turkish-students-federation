"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

/**
 * Two-step delete that lives in the page instead of a native `confirm()`.
 *
 * A browser dialog cannot be styled, blocks automation and assistive-tech
 * focus handling, and gave no way to say what failed. This shows the question
 * next to the row, keeps focus on the choice, and reports a failed delete
 * where the user is looking.
 */
export default function ConfirmDeleteButton({
  label,
  onConfirm,
  compact = false,
}: {
  /** Names the row for screen readers: "<label> sil". */
  label: string;
  /** Performs the delete; throw to report failure. */
  onConfirm: () => Promise<void> | void;
  compact?: boolean;
}) {
  const [step, setStep] = useState<"idle" | "confirming" | "pending">("idle");
  const [failed, setFailed] = useState(false);

  async function run() {
    setStep("pending");
    setFailed(false);
    try {
      await onConfirm();
    } catch {
      setFailed(true);
      setStep("idle");
    }
  }

  if (step === "idle") {
    return (
      <span className="inline-flex items-center gap-2">
        {failed && (
          <span role="alert" className="text-xs text-turkish-red">
            Silinemedi
          </span>
        )}
        <button
          type="button"
          onClick={() => setStep("confirming")}
          aria-label={`${label} sil`}
          className={compact ? "text-xs text-text-secondary hover:text-turkish-red" : "p-2 text-text-secondary hover:text-turkish-red"}
        >
          <Trash2 className={compact ? "w-3 h-3" : "w-4 h-4"} aria-hidden="true" />
        </button>
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center justify-end gap-2 text-sm" role="group" aria-label={`${label} silinsin mi?`}>
      <span>Silinsin mi?</span>
      <button type="button" autoFocus disabled={step === "pending"} onClick={run} className="admin-button admin-button-primary">
        {step === "pending" ? "Siliniyor…" : "Evet, sil"}
      </button>
      <button type="button" disabled={step === "pending"} onClick={() => setStep("idle")} className="admin-button admin-button-secondary">
        Vazgeç
      </button>
    </span>
  );
}
