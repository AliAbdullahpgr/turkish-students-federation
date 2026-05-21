"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Bold, Italic, Heading, Link, Image, List, Code, Columns, Edit3, Eye } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<EditorMode>("split");

  const insertAtCursor = useCallback(
    (before: string, after: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);
      const newText =
        value.substring(0, start) + before + selected + after + value.substring(end);

      onChange(newText);

      requestAnimationFrame(() => {
        textarea.focus();
        if (selected) {
          textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
        } else {
          const cursorPos = start + before.length;
          textarea.setSelectionRange(cursorPos, cursorPos);
        }
      });
    },
    [value, onChange]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!e.ctrlKey && !e.metaKey) return;

    if (e.key === "b") {
      e.preventDefault();
      insertAtCursor("**", "**");
    } else if (e.key === "i") {
      e.preventDefault();
      insertAtCursor("_", "_");
    } else if (e.key === "k") {
      e.preventDefault();
      const url = prompt("Link URL:");
      if (url) insertAtCursor("[", `](${url})`);
    }
  }

  function handleHeadingClick() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const lineStart = value.lastIndexOf("\n", textarea.selectionStart - 1) + 1;
    const lineEnd = value.indexOf("\n", textarea.selectionStart);
    const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
    const line = value.substring(lineStart, actualLineEnd);

    if (line.startsWith("### ")) {
      onChange(value.substring(0, lineStart) + line.replace("### ", "## ") + value.substring(actualLineEnd));
    } else if (line.startsWith("## ")) {
      onChange(value.substring(0, lineStart) + line.replace("## ", "# ") + value.substring(actualLineEnd));
    } else if (line.startsWith("# ")) {
      onChange(value.substring(0, lineStart) + line.replace("# ", "") + value.substring(actualLineEnd));
    } else {
      onChange(value.substring(0, lineStart) + "## " + line + value.substring(actualLineEnd));
    }

    requestAnimationFrame(() => textarea.focus());
  }

  function handleImageUpload(result: {
    public_id: string;
    secure_url: string;
    url: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
  }) {
    const alt = result.public_id.split("/").pop() || "image";
    insertAtCursor(`![${alt}](${result.secure_url})\n`);
  }

  const toolbarButtons = [
    { icon: Bold, label: "Kalın", action: () => insertAtCursor("**", "**") },
    { icon: Italic, label: "İtalik", action: () => insertAtCursor("_", "_") },
    { icon: Heading, label: "Başlık", action: handleHeadingClick },
    { icon: Link, label: "Link", action: () => { const url = prompt("Link URL:"); if (url) insertAtCursor("[", `](${url})`); } },
    { icon: List, label: "Liste", action: () => insertAtCursor("- ") },
    { icon: Code, label: "Kod", action: () => insertAtCursor("`", "`") },
  ];

  const html = renderMarkdown(value);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const adjustHeight = () => {
      textarea.style.height = "auto";
      textarea.style.height = Math.max(textarea.scrollHeight, parseInt(minHeight, 10)) + "px";
    };
    textarea.addEventListener("input", adjustHeight);
    adjustHeight();
    return () => textarea.removeEventListener("input", adjustHeight);
  }, [minHeight, value]);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1">
          {label}
        </label>
      )}

      <div className={`border rounded-card overflow-hidden ${error ? "border-turkish-red" : "border-border-custom"}`}>
        <div className="flex items-center justify-between bg-surface border-b border-border-custom px-3 py-1.5">
          <div className="flex items-center gap-0.5">
            {mode !== "preview" &&
              toolbarButtons.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={btn.action}
                  className="p-1.5 text-text-secondary hover:text-primary hover:bg-white rounded transition-colors"
                  title={btn.label}
                >
                  <btn.icon className="w-4 h-4" />
                </button>
              ))}
            {mode !== "preview" && (
              <CloudinaryUploadWidget onUpload={handleImageUpload}>
                <button
                  type="button"
                  className="p-1.5 text-text-secondary hover:text-primary hover:bg-white rounded transition-colors"
                  title="Resim Yükle"
                >
                  <Image className="w-4 h-4" />
                </button>
              </CloudinaryUploadWidget>
            )}
          </div>

          <div className="flex items-center bg-white rounded-md border border-border-custom">
            <button
              type="button"
              onClick={() => setMode("split")}
              className={`p-1.5 rounded-l-md transition-colors ${mode === "split" ? "bg-primary text-white" : "text-text-secondary hover:text-primary"}`}
              title="Bölünmüş Görünüm"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={`p-1.5 transition-colors ${mode === "edit" ? "bg-primary text-white" : "text-text-secondary hover:text-primary"}`}
              title="Sadece Düzenle"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`p-1.5 rounded-r-md transition-colors ${mode === "preview" ? "bg-primary text-white" : "text-text-secondary hover:text-primary"}`}
              title="Sadece Önizleme"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className={`${mode === "split" ? "flex flex-col md:flex-row" : ""}`}>
          {mode !== "preview" && (
            <div className={mode === "split" ? "flex-1 border-r border-border-custom" : ""}>
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full p-4 font-mono text-sm text-text-primary bg-white resize-none focus:outline-none border-0"
                style={{ minHeight, overflowY: "auto" }}
              />
            </div>
          )}

          {mode !== "edit" && (
            <div className={mode === "split" ? "flex-1" : ""}>
              <div
                className="p-4 prose prose-sm max-w-none text-text-primary"
                style={{ minHeight }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1 text-xs text-turkish-red">{error}</p>
      )}
    </div>
  );
}
