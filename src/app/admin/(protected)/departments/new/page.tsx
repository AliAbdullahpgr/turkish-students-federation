import PageHeader from "@/components/admin/PageHeader";
import DepartmentForm from "../DepartmentForm";

export default function NewDepartmentPage() {
  return (
    <div>
      <PageHeader title="Yeni Birim" backHref="/admin/departments" />
      <DepartmentForm endpoint="/api/admin/departments" method="POST" defaultValues={{}} submitLabel="Kaydet" />
    </div>
  );
}
