import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { getActivityPostById } from "@/db/queries/activity-posts";
import ActivityPostForm from "../../ActivityPostForm";

interface EditActivityPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditActivityPostPage({ params }: EditActivityPostPageProps) {
  const { id } = await params;
  const post = await getActivityPostById(id);

  if (!post) notFound();

  return (
    <div>
      <PageHeader title={`Düzenle: ${post.title}`} backHref="/admin/activity-posts" />
      <ActivityPostForm
        endpoint={`/api/admin/activity-posts/${post.id}`}
        method="PUT"
        defaultValues={{
          title: post.title,
          excerpt: post.excerpt,
          body: post.body ?? "",
          slug: post.slug,
          category: post.category ?? "Faaliyet",
          location: post.location ?? "",
          happenedAt: post.happenedAt?.slice(0, 10) ?? "",
          isPublished: post.isPublished ?? true,
        }}
        initialThumbnailMediaId={post.thumbnailMediaId}
        initialThumbnailUrl={post.thumbnail}
        submitLabel="Güncelle"
      />
    </div>
  );
}
