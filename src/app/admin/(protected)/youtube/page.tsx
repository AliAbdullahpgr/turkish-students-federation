import { AdminPageHeader } from "@/components/admin/AdminUi";
import YoutubeForm from "@/app/admin/(protected)/youtube/YoutubeForm";
import { getYoutubeSection } from "@/db/queries/site-settings";

export const metadata = { title: "YouTube bölümü" };

function errorMessage(code: string | undefined) {
  if (!code) return null;
  if (code === "video") {
    return "Video adresi bir YouTube videosuna işaret etmiyor. `https://www.youtube.com/watch?v=…` veya `https://youtu.be/…` biçiminde bir adres yapıştırın.";
  }
  if (code === "channel") {
    return "Kanal adresi geçerli değil. `https://www.youtube.com/@kanaladi` biçiminde bir adres girin.";
  }
  return "Kaydedilemedi. Alanları kontrol edip tekrar deneyin.";
}

export default async function AdminYoutubePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [youtube, params] = await Promise.all([getYoutubeSection(), searchParams]);

  return (
    <>
      <AdminPageHeader
        eyebrow="Website içeriği"
        title="YouTube bölümü"
        description="Anasayfadaki öne çıkan video ve kanal bağlantısı. Video adresini yapıştırmanız yeterli; yerleştirme otomatik oluşturulur."
      />
      <YoutubeForm
        youtube={youtube}
        saved={params.saved === "1"}
        error={errorMessage(params.error)}
      />
    </>
  );
}
