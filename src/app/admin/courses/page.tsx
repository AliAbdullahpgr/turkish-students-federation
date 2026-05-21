"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Course {
  id: string;
  title: string;
  instructor?: string | null;
}

export default function CoursesListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/courses").then((r) => r.json()).then(setCourses).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">Kurslar</h1>
        <Link href="/admin/courses/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"><Plus className="w-4 h-4" /> Yeni Kurs</Link>
      </div>
      {loading ? <p className="text-text-muted">Yükleniyor...</p> : (
        <div className="bg-white rounded-card shadow-card border border-border-custom overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead><tr className="border-b border-border-custom text-left"><th className="p-4 text-sm font-semibold text-text-secondary">Başlık</th><th className="p-4 text-sm font-semibold text-text-secondary">Eğitmen</th><th className="p-4 text-sm font-semibold text-text-secondary text-right">İşlemler</th></tr></thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-border-custom hover:bg-surface/50">
                  <td className="p-4 font-medium">{c.title}</td>
                  <td className="p-4 text-sm">{c.instructor}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/courses/${c.id}/edit`} className="p-2 text-text-secondary hover:text-primary"><Pencil className="w-4 h-4" /></Link>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-text-secondary hover:text-turkish-red"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
