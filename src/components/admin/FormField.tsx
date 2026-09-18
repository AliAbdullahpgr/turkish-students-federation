import React from "react";
import { FormField as AdminFormField } from "@/components/admin/AdminUi";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

/**
 * Kept as a thin re-export so the existing edit pages keep their default
 * import and pick up the ported field styling. New pages import
 * `FormField` from `AdminUi` directly.
 */
export default function FormField({ label, error, hint, required, children }: FormFieldProps) {
  return (
    <AdminFormField label={label} error={error} hint={hint} required={required}>
      {children}
    </AdminFormField>
  );
}
