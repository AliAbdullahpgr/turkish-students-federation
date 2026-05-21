import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

const editions = [
  {
    id: "1",
    title: "The Students Times - Nisan 2026",
    description: "Öğrenci aktivizmi, artan eğitim maliyetleri ve yaklaşan PTÖB etkinliklerini kapsıyor.",
    date: "NİS 2026",
  },
  {
    id: "2",
    title: "The Students Times - Mart 2026",
    description: "Liderlik gelişimi ve Türkiye genelindeki kampüs girişimlerine özel sayı.",
    date: "MAR 2026",
  },
  {
    id: "3",
    title: "The Students Times - Şubat 2026",
    description: "Uluslararası öğrenci ilişkileri ve eğitim politikası güncellemelerine odaklanıyor.",
    date: "ŞUB 2026",
  },
  {
    id: "4",
    title: "The Students Times - Ocak 2026",
    description: "2026 hedefleri ve geçen yılın başarılarının yansıtıldığı yıl açılışı.",
    date: "OCA 2026",
  },
  {
    id: "5",
    title: "The Students Times - Aralık 2025",
    description: "Büyük kilometre taşları, etkinlikler ve öğrenci başarı hikayelerini vurgulayan yıllık değerlendirme.",
    date: "ARA 2025",
  },
  {
    id: "6",
    title: "The Students Times - Kasım 2025",
    description: "Ulusal Öğrenci Konvansiyonu ve politika tartışmalarının derinlemesine kapsamı.",
    date: "KAS 2025",
  },
];

export const metadata: Metadata = {
  title: "The Students Times - Pakistan Türk Öğrenci Birliği",
  description:
    "Pakistan Türk Öğrenci Birliği'nin resmi yayını olan The Students Times'ı okuyun. Öğrenci konuları, etkinlikler ve başarılar hakkında bilgi sahibi olun.",
};

export default function StudentsTimesPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="The Students Times" accentWord="Students" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="RESMİ YAYIN" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                The <span className="text-accent">Students</span> Times
              </h2>
              <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
                Öğrenci konularına, başarılarına ve öğrenci topluluğunun sesine adanmış aylık yayınımız.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {editions.map((edition) => (
                <div
                  key={edition.id}
                  className="bg-surface rounded-[16px] p-8 transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full mb-4">
                    {edition.date}
                  </span>
                  <h3 className="text-lg font-bold text-text-primary mb-3">
                    {edition.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {edition.description}
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
