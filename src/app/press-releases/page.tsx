import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

const pressReleases = [
  {
    id: "1",
    title: "PTÖB 2026 İçin Yeni Liderlik Yapısını Duyurdu",
    date: "15 OCA 2026",
    excerpt:
      "Pakistan Türk Öğrenci Birliği, Türkiye'nin tüm bölgelerindeki öğrencilere daha iyi hizmet etmeyi amaçlayan yeniden yapılandırılmış bir liderlik modelini duyurmaktan mutluluk duyar.",
  },
  {
    id: "2",
    title: "Öğrenci Refahı Girişimi Ulusal Çapta Başlatıldı",
    date: "28 ARA 2025",
    excerpt:
      "Ekonomik zorluklarla karşı karşıya kalan öğrencilere destek ve kaynak sağlamak amacıyla yeni bir ulusal öğrenci refahı girişimi başlatıldı.",
  },
  {
    id: "3",
    title: "PTÖB Yerel Üniversitelerle Araştırma Programları İçin Ortaklık Kurdu",
    date: "10 ARA 2025",
    excerpt:
      "Pakistan Türk Öğrenci Birliği, öğrenciler arasında araştırma ve yeniliği teşvik etmek için önde gelen üniversitelerle ortaklıklar kurdu.",
  },
  {
    id: "4",
    title: "Yıllık Öğrenci Konvansiyonu Tarihleri Açıklandı",
    date: "22 KAS 2025",
    excerpt:
      "Yıllık PTÖB Öğrenci Konvansiyonu gelecek yaz İstanbul'da gerçekleşecek ve ülke genelinden öğrencileri bir araya getirecek.",
  },
  {
    id: "5",
    title: "PTÖB Dijital Öğrenme Platformunu Başlattı",
    date: "05 KAS 2025",
    excerpt:
      "Öğrencilere eğitim kaynaklarına ve çevrimiçi kurslara erişim sağlamak amacıyla yeni bir dijital öğrenme platformu başlatıldı.",
  },
  {
    id: "6",
    title: "İhtiyaç Sahibi Öğrenciler İçin Dayanışma Fonu",
    date: "18 EKİ 2025",
    excerpt:
      "Pakistan Türk Öğrenci Birliği, akademik yolculukları sırasında maddi zorluklarla karşı karşıya kalan öğrencilere destek olmak amacıyla bir dayanışma fonu oluşturdu.",
  },
];

export const metadata: Metadata = {
  title: "Basın Açıklamaları - Pakistan Türk Öğrenci Birliği",
  description:
    "Pakistan Türk Öğrenci Birliği'nin resmi basın açıklamaları. En son duyurular ve girişimlerle güncel kalın.",
};

export default function PressReleasesPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Basın Açıklamaları" accentWord="Açıklamaları" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="RESMİ AÇIKLAMALAR" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Son <span className="text-accent">Basın</span> Açıklamaları
              </h2>
              <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
                Pakistan Türk Öğrenci Birliği&apos;nin en son duyuruları, girişimleri ve resmi açıklamalarıyla bilgi sahibi olun.
              </p>
            </div>

            <div className="space-y-6">
              {pressReleases.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface rounded-[16px] p-6 lg:p-8 transition-all hover:-translate-y-1 hover:shadow-card-hover border-l-4 border-accent"
                >
                  <span className="text-[11px] font-bold text-accent uppercase tracking-[1.5px] block mb-3">
                    {item.date}
                  </span>
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
