"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FormData { id: string; parentId: string; title: string; content: string; level: number; sortOrder: number; }

export default function NewGuideSectionPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { level: 2, sortOrder: 0 } });
  const [parents, setParents] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/guide-sections").then((r) => r.json()).then(setParents);
  }, []);

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/admin/guide-sections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) router.push("/admin/guide-sections");
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6"><Link href="/admin/guide-sections" className="text-text-secondary hover:text-primary"><ArrowLeft className="w-5 h-5" /></Link><h1 className="text-2xl font-heading font-bold text-text-primary">Yeni Bölüm</h1></div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Slug ID</label><input {...register("id")} placeholder="ornek-id" className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Üst Bölüm</label>
          <select {...register("parentId")} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent">
            <option value="">Yok (üst seviye)</option>
            {parents.filter((p) => p.id).map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Başlık</label><input {...register("title", { required: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">İçerik</label><textarea {...register("content")} rows={5} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Seviye (1-4)</label><input type="number" {...register("level", { valueAsNumber: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Sıra</label><input type="number" {...register("sortOrder", { valueAsNumber: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        </div>
        <div className="flex gap-3"><button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">Kaydet</button><Link href="/admin/guide-sections" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">İptal</Link></div>
      </form>
    </div>
  );
}
