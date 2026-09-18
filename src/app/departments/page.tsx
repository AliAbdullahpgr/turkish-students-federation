import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import PageHero from "@/components/ui/PageHero";

const departments = [
  {
    id: "1",
    name: "Medya & Yayınlar",
    description:
      "Dijital varlığı, sosyal medyayı, bültenleri ve resmi yayınları yönetmekten sorumludur. Öğrenciler ve kamuoyuyla etkili iletişim sağlar.",
    icon: "📢",
  },
  {
    id: "2",
    name: "Öğrenci Refahı",
    description:
      "Öğrenci refahına, mali yardım programlarına, ruh sağlığı girişimlerine ve ihtiyaç sahibi öğrenciler için destek hizmetlerine odaklanır.",
    icon: "🤝",
  },
  {
    id: "3",
    name: "İslami Eğitim",
    description:
      "Dini eğitim arayan öğrenciler için Kuran dersleri, İslami çalışmalar atölyeleri ve manevi gelişim programları düzenler.",
    icon: "📖",
  },
  {
    id: "4",
    name: "Etkinlik Yönetimi",
    description:
      "Yerel ve ulusal düzeyde konferansları, seminerleri, kültürel etkinlikleri ve öğrenci buluşmalarını planlar ve yürütür.",
    icon: "🎉",
  },
  {
    id: "5",
    name: "Araştırma & Geliştirme",
    description:
      "Akademik araştırmayı, yeniliği ve çeşitli disiplinlerde öğrenciler ile öğretim üyeleri arasındaki işbirliğini teşvik eder.",
    icon: "🔬",
  },
  {
    id: "6",
    name: "Uluslararası İlişkiler",
    description:
      "Dünya çapındaki öğrenci örgütleriyle bağlantılar kurar, değişim programlarını yönetir ve uluslararası forumlarda PTÖB'yi temsil eder.",
    icon: "🌍",
  },
];

export const metadata: Metadata = {
  title: "Birimlerimiz - Pakistan Türk Öğrenci Birliği",
  description:
    "Pakistan Türk Öğrenci Birliği içindeki çeşitli birimleri ve öğrenci topluluğuna hizmet rollerini keşfedin.",
};

export default function DepartmentsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Birimlerimiz" accentWord="Birimler" />

        <section className="py-section bg-white border-t border-border-custom">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <p className="mb-10 max-w-[60ch] text-body text-text-secondary">
              Öğrenci topluluğuna hizmet etmek ve misyonumuzu ilerletmek için birlikte çalışan özel birimlerimiz.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="bg-surface rounded-[16px] p-8 transition-all hover:-translate-y-1 text-center border border-border-custom"
                >
                  <div className="text-4xl mb-4">{dept.icon}</div>
                  <h3 className="text-lg font-bold text-text-primary mb-3">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {dept.description}
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
