import PageHeader from "@/components/admin/PageHeader";
import ActivityPostForm from "../ActivityPostForm";

export default function NewActivityPostPage() {
  return (
    <div>
      <PageHeader title="Yeni Faaliyet" backHref="/admin/activity-posts" />
      <ActivityPostForm
        endpoint="/api/admin/activity-posts"
        method="POST"
        defaultValues={{}}
        submitLabel="Kaydet"
      />
    </div>
  );
}
