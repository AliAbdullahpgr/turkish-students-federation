import { AdminPageHeader } from "@/components/admin/AdminUi";
import { getHeroSlidesForAdmin } from "@/db/queries/home-sections";
import { HERO_SLIDES_ERROR_MESSAGES, type HeroSlidesError } from "@/lib/hero-slides";
import SliderManager from "./SliderManager";

export const metadata = { title: "Slayt yöneticisi" };

export default async function AdminSliderPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [{ slides, customised }, params] = await Promise.all([getHeroSlidesForAdmin(), searchParams]);
  const error =
    params.error && params.error in HERO_SLIDES_ERROR_MESSAGES
      ? HERO_SLIDES_ERROR_MESSAGES[params.error as HeroSlidesError]
      : params.error
        ? "Kaydedilemedi. Alanları kontrol edip tekrar deneyin."
        : null;

  return (
    <>
      <AdminPageHeader
        eyebrow="Website içeriği"
        title="Slayt yöneticisi"
        description="Anasayfanın üstündeki büyük alan. Slayt ekleyin, sıralayın, gizleyin; her slaytın kendi başlığı, butonu ve görseli olur."
      />
      {params.saved === "1" && (
        <div className="admin-feedback admin-feedback-success mb-6" role="status">
          Slaytlar kaydedildi. Değişiklikler siteye yansıdı.
        </div>
      )}
      {error && (
        <div className="admin-feedback admin-feedback-error mb-6" role="alert">
          {error} Hiçbir değişiklik kaydedilmedi.
        </div>
      )}
      {!customised && (
        <p className="mb-6 text-sm text-text-secondary">
          Şu an sitede Anasayfa ekranındaki üst bölüm gösteriliyor; aşağıda 1. slayt olarak yüklendi. Kaydettiğinizde
          slaytlar onun yerini alır.
        </p>
      )}
      <SliderManager initialSlides={slides} />
    </>
  );
}
