"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FormData { label: string; href: string; parentId: string; sortOrder: number; }

export default function NewNavigationItemPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { sortOrder: 0 } });
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/navigation").then((r) => r.json()).then(setItems);
  }, []);

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/admin/navigation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) router.push("/admin/navigation");
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6"><Link href="/admin/navigation" className="text-text-secondary hover:text-primary"><ArrowLeft className="w-5 h-5" /></Link><h1 className="text-2xl font-heading font-bold text-text-primary">Yeni Navigasyon Linki</h1></div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Etiket</label><input {...register("label", { required: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Link</label><input {...register("href", { required: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Üst Link (dropdown için)</label>
          <select {...register("parentId")} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent">
            <option value="">Yok (ana link)</option>
            {items.filter((i) => i.id).map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
          </select>
        </div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Sıra</label><input type="number" {...register("sortOrder", { valueAsNumber: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div className="flex gap-3"><button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">Kaydet</button><Link href="/admin/navigation" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">İptal</Link></div>
      </form>
    </div>
  );
}
