import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

const books = [
  {
    id: "1",
    title: "Gençlik Liderliği Rehberi",
    description: "İletişim, organizasyon ve savunuculuk becerilerini kapsayan kapsamlı bir öğrenci liderliği rehberi.",
    category: "Liderlik",
  },
  {
    id: "2",
    title: "İslami Çalışmalar Çalışma Kitabı",
    description: "Üniversite öğrencileri için tasarlanmış Kuran dersleri ve İslami öğrenme çalışma kitabı.",
    category: "Eğitim",
  },
  {
    id: "3",
    title: "Öğrenci Aktivizmi El Kitabı",
    description: "Öğrenci hareketleri, kampanyalar ve öğrenci hakları savunuculuğu hakkında pratik bir el kitabı.",
    category: "Aktivizm",
  },
  {
    id: "4",
    title: "Türkiye'de Öğrenci Hareketleri Tarihi",
    description: "Türk tarihi boyunca öğrenci örgütlerinin evrimi ve etkisine derinlemesine bir bakış.",
    category: "Tarih",
  },
  {
    id: "5",
    title: "Etkili Çalışma Teknikleri",
    description: "Akademik performansı, zaman yönetimini ve sınav hazırlığını iyileştirmek için araştırmaya dayalı yöntemler.",
    category: "Akademik",
  },
  {
    id: "6",
    title: "Topluluk İnşası",
    description: "Kampüste ve ötesinde güçlü, kapsayıcı öğrenci toplulukları oluşturmak için stratejiler.",
    category: "Topluluk",
  },
];

export const metadata: Metadata = {
  title: "Kitaplar - Pakistan Türk Öğrenci Birliği",
  description:
    "Liderlik rehberleri, eğitim çalışma kitapları ve öğrenci aktivizmi kaynakları dahil olmak üzere kitap koleksiyonumuzu keşfedin.",
};

export default function BooksPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Kitap Koleksiyonu" accentWord="Kitap" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="KÜTÜPHANE" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Kitap <span className="text-accent">Koleksiyonu</span>
              </h2>
              <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
                Liderlik, eğitim, aktivizm ve öğrenci gelişimi odaklı özenle seçilmiş kitap koleksiyonumuzu keşfedin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-surface rounded-[16px] p-8 transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase rounded-full mb-4">
                    {book.category}
                  </span>
                  <h3 className="text-lg font-bold text-text-primary mb-3">
                    {book.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {book.description}
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
