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
      {label && <label className="mb-1 block text-sm font-medium text-text-secondary">{label}</label>}

      <div
        className={`overflow-hidden rounded-card border ${
          error ? "border-turkish-red" : "border-border-custom"
        }`}
      >
        <div className="flex items-center justify-end border-b border-border-custom bg-surface px-3 py-1.5">
          <div className="flex items-center rounded-md border border-border-custom bg-white">
            <button
              type="button"
              onClick={() => setMode("split")}
              className={`rounded-l-md px-2 py-1 text-xs transition-colors ${
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
              className={`rounded-r-md px-2 py-1 text-xs transition-colors ${
                mode === "preview" ? "bg-primary text-white" : "text-text-secondary hover:text-primary"
              }`}
            >
              Önizle
            </button>
          </div>
        </div>

        <MDEditor
          value={value}
          onChange={(nextValue) => onChange(nextValue || "")}
          preview={preview}
          height={minHeight}
          visibleDragbar={false}
          // The library's fullscreen mode (also Ctrl/Cmd+0 inside the editor)
          // writes `overflow: hidden` to <body> and never restores it if the
          // editor unmounts while fullscreen, which locked scrolling on every
          // admin page after the next navigation.
          overflow={false}
          textareaProps={{ placeholder }}
        />
      </div>

      {error && <p className="mt-1 text-xs text-turkish-red">{error}</p>}
    </div>
  );
}
