import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

const literatureItems = [
  {
    id: "1",
    title: "The Students Times",
    description: "Öğrenci konularını ve başarılarını kapsayan aylık bülten.",
    type: "Bülten",
  },
  {
    id: "2",
    title: "PTÖB Dergisi 2025",
    description: "PTÖB'nin yıl içindeki faaliyetlerini özetleyen yıllık dergi.",
    type: "Dergi",
  },
  {
    id: "3",
    title: "Gençlik Liderliği Rehberi",
    description: "Geleceğin öğrenci liderleri için kapsamlı bir rehber.",
    type: "Kitap",
  },
  {
    id: "4",
    title: "İslami Çalışmalar Çalışma Kitabı",
    description: "Kuran dersleri ve İslami öğrenme için eğitim çalışma kitabı.",
    type: "Çalışma Kitabı",
  },
  {
    id: "5",
    title: "Basın Açıklaması Arşivi",
    description: "Pakistan Türk Öğrenci Birliği'nin tüm resmi basın açıklamaları koleksiyonu.",
    type: "Arşiv",
  },
  {
    id: "6",
    title: "Yıllık Rapor 2025",
    description: "PTÖB'nin faaliyetleri, etkisi ve mali durumuna ilişkin detaylı rapor.",
    type: "Rapor",
  },
];

export const metadata: Metadata = {
  title: "Edebiyat - Pakistan Türk Öğrenci Birliği",
  description:
    "Pakistan Türk Öğrenci Birliği'nin edebiyat koleksiyonunu keşfedin; dergiler, bültenler, kitaplar ve raporlar.",
};

export default function LiteraturePage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Edebiyat" accentWord="Edebiyat" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="KÜTÜPHANE" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Edebiyat <span className="text-accent">Koleksiyonu</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {literatureItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface rounded-[16px] p-8 transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase rounded-full mb-4">
                    {item.type}
                  </span>
                  <h3 className="text-lg font-bold text-text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
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
