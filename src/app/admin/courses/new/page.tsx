"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FormData { title: string; instructor: string; description: string; href: string; }

export default function NewCoursePage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { href: "#" } });

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/admin/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) router.push("/admin/courses");
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6"><Link href="/admin/courses" className="text-text-secondary hover:text-primary"><ArrowLeft className="w-5 h-5" /></Link><h1 className="text-2xl font-heading font-bold text-text-primary">Yeni Kurs</h1></div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Başlık</label><input {...register("title", { required: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Eğitmen</label><input {...register("instructor")} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Açıklama</label><textarea {...register("description")} rows={3} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Link</label><input {...register("href")} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div className="flex gap-3"><button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">Kaydet</button><Link href="/admin/courses" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">İptal</Link></div>
      </form>
    </div>
  );
}
