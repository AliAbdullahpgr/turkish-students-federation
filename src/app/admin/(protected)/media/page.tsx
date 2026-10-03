"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

interface MediaItem {
  id: string;
  cloudinaryPublicId: string;
  url: string;
  secureUrl: string;
  width: number | null;
  height: number | null;
  format: string | null;
  createdAt: string | null;
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/media").then((r) => r.json()).then(setItems).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("delete failed");
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function copyUrl(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Medya Kütüphanesi</h1>
      <p className="text-sm text-text-muted mb-6">Medya dosyaları Cloudinary Upload Widget üzerinden yüklenir. Yükleme yapmak için herhangi bir içerik formundaki &quot;Resim Yükle&quot; butonunu kullanın.</p>

      {loading ? <p className="text-text-muted">Yükleniyor...</p> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-card shadow-card border border-border-custom overflow-hidden">
              <div className="aspect-square bg-surface flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.secureUrl} alt={item.cloudinaryPublicId} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs text-text-muted truncate">{item.cloudinaryPublicId}</p>
                <p className="text-xs text-text-muted">{item.width}×{item.height} · {item.format}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => copyUrl(item.secureUrl, item.id)} className="flex items-center gap-1 text-xs text-text-secondary hover:text-primary">
                    {copied === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === item.id ? "Kopyalandı" : "URL"}
                  </button>
                  <ConfirmDeleteButton label={item.cloudinaryPublicId} onConfirm={() => handleDelete(item.id)} compact />
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="col-span-full text-center text-text-muted py-8">Henüz medya yok.</p>}
        </div>
      )}
    </div>
  );
}
