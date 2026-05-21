"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FormData { name: string; role: string; bio: string; order: number; isActive: boolean; }

export default function NewTeamMemberPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { order: 0, isActive: true } });

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/admin/team-members", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/team-members");
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/team-members" className="text-text-secondary hover:text-primary"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Yeni Ekip Üyesi</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div><label className="block text-sm font-medium text-text-secondary mb-1">İsim</label><input {...register("name", { required: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Rol</label><input {...register("role", { required: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div><label className="block text-sm font-medium text-text-secondary mb-1">Biyografi</label><textarea {...register("bio")} rows={3} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Sıra</label><input type="number" {...register("order", { valueAsNumber: true })} className="w-full px-4 py-2 border border-border-custom rounded-md text-sm bg-white focus:outline-none focus:border-accent" /></div>
          <div className="flex items-center gap-2 pt-6"><input type="checkbox" {...register("isActive")} /><label className="text-sm text-text-secondary">Aktif</label></div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">Kaydet</button>
          <Link href="/admin/team-members" className="px-6 py-2.5 border border-border-custom rounded-md text-sm font-medium text-text-secondary hover:bg-surface">İptal</Link>
        </div>
      </form>
    </div>
  );
}
