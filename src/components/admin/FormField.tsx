import React from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({ label, error, hint, required, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1">
        {label}
        {required && <span className="text-turkish-red ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-text-muted">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-turkish-red">{error}</p>
      )}
    </div>
  );
}
