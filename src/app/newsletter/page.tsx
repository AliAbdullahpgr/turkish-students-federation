import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import PrimaryButton from "@/components/ui/PrimaryButton";

const newsletters = [
  {
    id: "1",
    title: "PTÖB Bülteni - Nisan 2026",
    description: "Yaklaşan etkinlikler, yeni üyelik avantajları ve öğrenci başarı hikayeleri hakkında güncellemeler.",
    date: "NİS 2026",
  },
  {
    id: "2",
    title: "PTÖB Bülteni - Mart 2026",
    description: "Liderlik Zirvesi'nden öne çıkanlar ve yaklaşan gönüllülük fırsatları.",
    date: "MAR 2026",
  },
  {
    id: "3",
    title: "PTÖB Bülteni - Şubat 2026",
    description: "Ulusal Öğrenci Günü kutlamalarının kapsamı ve burs duyuruları.",
    date: "ŞUB 2026",
  },
  {
    id: "4",
    title: "PTÖB Bülteni - Ocak 2026",
    description: "Yeni yıl hedefleri, birim güncellemeleri ve yeni üyelere hoş geldiniz.",
    date: "OCA 2026",
  },
];

export const metadata: Metadata = {
  title: "Bülten - Pakistan Türk Öğrenci Birliği",
  description:
    "Pakistan Türk Öğrenci Birliği bültenine abone olun. En son haberler, etkinlikler ve öğrenci girişimleriyle güncel kalın.",
};

export default function NewsletterPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="PTÖB Bülteni" accentWord="Bülteni" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="GÜNCEL KALIN" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Bültenimize <span className="text-accent">Abone Olun</span>
              </h2>
              <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
                Etkinlikler, girişimler ve öğrenci haberleriyle ilgili en son güncellemeleri doğrudan gelen kutunuza alın.
              </p>
            </div>

            <div className="max-w-[600px] mx-auto mb-16">
              <div className="bg-surface rounded-[16px] p-8">
                <form className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="E-posta adresinizi girin"
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-accent"
                  />
                  <PrimaryButton type="submit" className="w-full">
                    Hemen Abone Ol
                  </PrimaryButton>
                </form>
                <p className="text-xs text-text-muted text-center mt-4">
                  Gizliliğinize saygı duyuyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.
                </p>
              </div>
            </div>

            <div className="text-center mb-12">
              <SectionEyebrow text="ARŞİV" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Geçmiş <span className="text-accent">Bültenler</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {newsletters.map((newsletter) => (
                <div
                  key={newsletter.id}
                  className="bg-surface rounded-[16px] p-8 transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full mb-4">
                    {newsletter.date}
                  </span>
                  <h3 className="text-lg font-bold text-text-primary mb-3">
                    {newsletter.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {newsletter.description}
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
