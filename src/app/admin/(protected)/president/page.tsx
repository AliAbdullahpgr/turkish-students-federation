import { AdminPageHeader } from "@/components/admin/AdminUi";
import PresidentForm from "@/app/admin/(protected)/president/PresidentForm";
import { getPresidentSection } from "@/db/queries/site-settings";

export const metadata = { title: "Başkan bölümü" };

/** `?error=…` → a sentence the editor can act on. */
function errorMessage(code: string | undefined) {
  if (!code) return null;
  if (code === "required") {
    return "Başkanın adı ve görevi zorunludur. Hiçbir değişiklik kaydedilmedi.";
  }
  if (code === "image") {
    return "Fotoğraf adresi geçerli değil. `/image/…` ile başlayan bir yol veya `https://` ile başlayan bir adres girin.";
  }
  return "Kaydedilemedi. Alanları kontrol edip tekrar deneyin.";
}

export default async function AdminPresidentPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [president, params] = await Promise.all([getPresidentSection(), searchParams]);

  return (
    <>
      <AdminPageHeader
        eyebrow="Website içeriği"
        title="Başkan bölümü"
        description="Anasayfadaki başkan kartı. Adı, görevi, mesajı ve fotoğrafı buradan güncelleyin."
      />
      <PresidentForm
        president={president}
        saved={params.saved === "1"}
        error={errorMessage(params.error)}
      />
    </>
  );
}
