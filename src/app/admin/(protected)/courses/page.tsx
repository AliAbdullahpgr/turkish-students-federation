"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

interface Course {
  id: string;
  title: string;
  instructor?: string | null;
}

export default function CoursesListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((r) => r.json())
      .then(setCourses)
      .finally(() => setLoading(false));
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
        <Link href="/admin/courses/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
          <Plus className="w-4 h-4" /> Yeni Kurs
        </Link>
      </div>

      <DataTable
        loading={loading}
        data={courses}
        columns={[
          { key: "title", header: "Başlık" },
          { key: "instructor", header: "Eğitmen" },
        ]}
        actions={(c) => (
          <div className="flex items-center justify-end gap-2">
            <Link href={`/admin/courses/${c.id}/edit`} className="p-2 text-text-secondary hover:text-primary">
              <Pencil className="w-4 h-4" />
            </Link>
            <button onClick={() => handleDelete(c.id)} className="p-2 text-text-secondary hover:text-turkish-red">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />
    </div>
  );
}
