"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";

interface ImagePickerProps {
  value: string | null; // mediaId
  previewUrl?: string | null;
  onChange: (mediaId: string, secureUrl: string) => void;
  onClear: () => void;
}

export default function ImagePicker({ previewUrl, onChange, onClear }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(result: {
    public_id: string;
    secure_url: string;
    url: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
  }) {
    setUploading(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cloudinaryPublicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          resourceType: result.resource_type,
        }),
      });
      const media = await res.json();
      onChange(media.id, result.secure_url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {previewUrl ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview"
            className="w-48 h-48 object-cover rounded-md border border-border-custom"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute -top-2 -right-2 w-6 h-6 bg-turkish-red text-white rounded-full flex items-center justify-center hover:bg-red-700"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <CloudinaryUploadWidget onUpload={handleUpload} disabled={uploading}>
          <div className="w-48 h-48 border-2 border-dashed border-border-custom rounded-md flex flex-col items-center justify-center gap-2 text-text-muted hover:border-accent hover:text-accent transition-colors bg-surface">
            {uploading ? (
              <span className="text-sm">Yükleniyor...</span>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-xs">Resim Yükle</span>
              </>
            )}
          </div>
        </CloudinaryUploadWidget>
      )}
    </div>
  );
}
