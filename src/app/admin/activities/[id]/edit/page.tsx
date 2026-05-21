"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FormData { title: string; description: string; icon: string; sortOrder: number; }

const ICON_OPTIONS = [
  "Monitor", "Users", "BookOpen", "Trophy", "Shield", "Heart", "Music", "Camera",
  "Globe", "Zap", "Star", "Sun", "Moon", "Cloud", "Anchor", "Bell",
];

export default function EditActivityPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    fetch(`/api/admin/activities/${id}`).then((r) => r.json()).then((data) => { reset(data); setLoading(false); });
  }, [id, reset]);

  async function onSubmit(data: FormData) {
    const res = await fetch(`/api/admin/activities/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) router.push("/admin/activities");
  }

  if (loading) return <p className="text-text-muted">Yükleniyor...</p>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6"><Link href="/admin/activities" className="text-text-secondary hover:text-primary"><ArrowLeft className="w-5 h-5" /></Link><h1 className="text-2xl font-heading font-bold text-text-primary">Aktivite Düzenle</h1></div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Başlık</label><input {...register("title", { required: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Açıklama</label><textarea {...register("description")} rows={3} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">İkon</label><select {...register("icon")} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent">{ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}</select></div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Sıra</label><input type="number" {...register("sortOrder", { valueAsNumber: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div className="flex gap-3"><button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">Güncelle</button><Link href="/admin/activities" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">İptal</Link></div>
      </form>
    </div>
  );
}
