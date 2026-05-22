"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import "./markdown-editor.css";

type EditorMode = "split" | "edit" | "preview";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
  error?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "İçerik yazın...",
  minHeight = "320px",
  label,
  error,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<EditorMode>("split");

  const preview = mode === "edit" ? "edit" : mode === "preview" ? "preview" : "live";

  return (
    <div data-color-mode="light">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1">
          {label}
        </label>
      )}

      <div
        className={`border rounded-card overflow-hidden ${
          error ? "border-turkish-red" : "border-border-custom"
        }`}
      >
        <div className="flex items-center justify-end bg-surface border-b border-border-custom px-3 py-1.5">
          <div className="flex items-center bg-white rounded-md border border-border-custom">
            <button
              type="button"
              onClick={() => setMode("split")}
              className={`px-2 py-1 text-xs rounded-l-md transition-colors ${
                mode === "split" ? "bg-primary text-white" : "text-text-secondary hover:text-primary"
              }`}
            >
              Bölünmüş
            </button>
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={`px-2 py-1 text-xs transition-colors ${
                mode === "edit" ? "bg-primary text-white" : "text-text-secondary hover:text-primary"
              }`}
            >
              Düzenle
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`px-2 py-1 text-xs rounded-r-md transition-colors ${
                mode === "preview" ? "bg-primary text-white" : "text-text-secondary hover:text-primary"
              }`}
            >
              Önizle
            </button>
          </div>
        </div>

        <MDEditor
          value={value}
          onChange={(v) => onChange(v || "")}
          preview={preview}
          height={minHeight}
          visibleDragbar={false}
          textareaProps={{ placeholder }}
        />
      </div>

      {error && <p className="mt-1 text-xs text-turkish-red">{error}</p>}
    </div>
  );
}
