import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { getDepartmentById } from "@/db/queries/departments";
import DepartmentForm from "../../DepartmentForm";

interface EditDepartmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDepartmentPage({ params }: EditDepartmentPageProps) {
  const { id } = await params;
  const department = await getDepartmentById(id);

  if (!department) notFound();

  return (
    <div>
      <PageHeader title={`Düzenle: ${department.name}`} backHref="/admin/departments" />
      <DepartmentForm
        endpoint={`/api/admin/departments/${department.id}`}
        method="PUT"
        defaultValues={{
          name: department.name,
          slug: department.slug,
          summary: department.summary,
          icon: department.icon,
          body: department.body ?? "",
          sortOrder: department.sortOrder ?? 0,
          isPublished: department.isPublished ?? true,
        }}
        initialHeroMediaId={department.heroMediaId}
        initialHeroUrl={department.hero}
        initialMembers={department.members.map((m) => ({
          name: m.name,
          role: m.role,
          photoMediaId: m.photoMediaId,
          photoUrl: m.photo,
        }))}
        initialGallery={department.gallery.map((g) => ({
          mediaId: g.mediaId,
          url: g.url,
          caption: g.caption,
        }))}
        submitLabel="Güncelle"
      />
    </div>
  );
}
