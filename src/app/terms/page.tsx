import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

export const metadata: Metadata = {
  title: "Kullanım Koşulları - Pakistan Türk Öğrenci Birliği",
  description:
    "Pakistan Türk Öğrenci Birliği web sitesi ve hizmetlerini kullanmak için kullanım koşulları.",
};

export default function TermsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Kullanım Koşulları" accentWord="Koşulları" />

        <section className="py-section bg-white">
          <div className="max-w-[800px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="YASAL" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Kullanım <span className="text-accent">Koşulları</span>
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">1. Giriş</h3>
                <p className="text-sm leading-relaxed">
                  Pakistan Türk Öğrenci Birliği&apos;ne (PTÖB) hoş geldiniz. Bu web sitesine erişerek ve kullanarak, bu anlaşmanın şartlarını ve hükümlerini kabul etmiş ve bağlı olmayı kabul etmiş sayılırsınız.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">2. Web Sitesinin Kullanımı</h3>
                <p className="text-sm leading-relaxed">
                  Bu web sitesinin içeriği yalnızca genel bilginiz ve kullanımınız içindir. Önceden haber verilmeksizin değişikliğe tabidir. Bu web sitesinin yetkisiz kullanımı, zarar talebine ve/veya cezai suça yol açabilir.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">3. Üyelik</h3>
                <p className="text-sm leading-relaxed">
                  PTÖB üyeliği, değerlerimizi ve misyonumuzu paylaşan tüm öğrencilere açıktır. Üyelerin kuruluşun ilkelerini savunması ve davranış kurallarımıza uygun hareket etmesi beklenir.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">4. Fikri Mülkiyet</h3>
                <p className="text-sm leading-relaxed">
                  Bu web sitesindeki tüm içerik, metin, grafikler, logolar ve görseller dahil ancak bunlarla sınırlı olmamak üzere, Pakistan Türk Öğrenci Birliği&apos;nin mülkiyetindedir ve telif hakkı yasalarıyla korunmaktadır.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">5. Sorumluluğun Sınırlandırılması</h3>
                <p className="text-sm leading-relaxed">
                  Pakistan Türk Öğrenci Birliği, bu web sitesinin kullanımından veya kullanılamamasından kaynaklanan doğrudan, dolaylı, arızi veya sonuçsal zararlardan sorumlu tutulamaz.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">6. Uygulanacak Hukuk</h3>
                <p className="text-sm leading-relaxed">
                  Bu kullanım koşulları, Türkiye Cumhuriyeti kanunlarına tabidir. Herhangi bir anlaşmazlık, Türkiye mahkemelerinin münhasır yargı yetkisine tabi olacaktır.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">7. Koşullardaki Değişiklikler</h3>
                <p className="text-sm leading-relaxed">
                  Pakistan Türk Öğrenci Birliği, bu koşulları herhangi bir zamanda değiştirme hakkını saklı tutar. Değişiklikler web sitesinde yayınlandığı anda yürürlüğe girer. Değişikliklerden sonraki web sitesini kullanmaya devam etmeniz, bu değişikliklerin kabulü anlamına gelir.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">8. İletişim Bilgileri</h3>
                <p className="text-sm leading-relaxed">
                  Bu Kullanım Koşulları hakkında herhangi bir sorunuz varsa, lütfen İletişim sayfamız aracılığıyla veya info@tsfturkey.org adresinden bize ulaşın.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
