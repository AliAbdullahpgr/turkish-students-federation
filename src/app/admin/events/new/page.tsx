"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EventForm {
  title: string;
  category: string;
  status: "upcoming" | "recent";
  date: string;
  location: string;
}

export default function NewEventPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<EventForm>({ defaultValues: { status: "upcoming" } });

  async function onSubmit(data: EventForm) {
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/events");
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/events" className="text-text-secondary hover:text-primary"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Yeni Etkinlik</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Başlık</label>
          <input {...register("title", { required: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Kategori</label>
            <input {...register("category")} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Durum</label>
            <select {...register("status")} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent">
              <option value="upcoming">Yaklaşan</option>
              <option value="recent">Geçmiş</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tarih</label>
            <input {...register("date")} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Konum</label>
            <input {...register("location")} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">Kaydet</button>
          <Link href="/admin/events" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">İptal</Link>
        </div>
      </form>
    </div>
  );
}
