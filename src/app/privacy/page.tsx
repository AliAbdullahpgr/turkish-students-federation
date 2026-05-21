import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

export const metadata: Metadata = {
  title: "Gizlilik Politikası - Pakistan Türk Öğrenci Birliği",
  description:
    "Pakistan Türk Öğrenci Birliği web sitesi için gizlilik politikası. Kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu öğrenin.",
};

export default function PrivacyPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Gizlilik Politikası" accentWord="Politikası" />

        <section className="py-section bg-white">
          <div className="max-w-[800px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="VERİ KORUMA" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Gizlilik <span className="text-accent">Politikası</span>
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">1. Topladığımız Bilgiler</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Pakistan Türk Öğrenci Birliği, üyelik kaydı, bülten aboneliği veya bizimle iletişime geçtiğinizde gönüllü olarak verdiğiniz kişisel bilgileri toplar. Bunlar adınız, e-posta adresiniz, telefon numaranız ve kurumsal bağlantınız olabilir.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">2. Bilgilerinizi Nasıl Kullanıyoruz</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Topladığımız bilgileri PTÖB faaliyetleri hakkında sizinle iletişim kurmak, üyelik başvurunuzu işlemek, bülten ve güncellemeler göndermek ve hizmetlerimizi iyileştirmek için kullanıyoruz. Kişisel bilgilerinizi üçüncü taraflara satmıyor veya kiralamıyoruz.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">3. Veri Güvenliği</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Kişisel verilerinizi yetkisiz erişime, değişikliğe, ifşaya veya imhaya karşı korumak için uygun teknik ve organizasyonel önlemler uyguluyoruz. Ancak, internet üzerinden iletimin %100 güvenli olmadığını unutmayın.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">4. Çerezler</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Web sitemiz, gezinti deneyiminizi geliştirmek için çerezler kullanabilir. Tarayıcı ayarlarınız aracılığıyla çerezleri devre dışı bırakmayı seçebilirsiniz, ancak bu web sitemizdeki bazı özelliklerin işlevselliğini etkileyebilir.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">5. Üçüncü Taraf Bağlantıları</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Web sitemiz üçüncü taraf web sitelerine bağlantılar içerebilir. Bu harici sitelerin gizlilik uygulamalarından veya içeriklerinden sorumlu değiliz. Ziyaret ettiğiniz herhangi bir üçüncü taraf sitesinin gizlilik politikalarını incelemenizi öneririz.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">6. Haklarınız</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Kişisel bilgilerinize erişme, düzeltme veya silme hakkına sahipsiniz. Ayrıca verilerinizin işlenmesi için verdiğiniz izni herhangi bir zamanda geri çekebilirsiniz. Bu hakları kullanmak için lütfen İletişim sayfamızda sağlanan bilgileri kullanarak bize ulaşın.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">7. Bu Politikadaki Değişiklikler</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Bu Gizlilik Politikası&apos;nı zaman zaman güncelleyebiliriz. Herhangi bir değişiklik bu sayfada güncellenmiş bir yürürlük tarihiyle yayınlanacaktır. Bu politikayı periyodik olarak incelemenizi öneririz.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">8. Bize Ulaşın</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Bu Gizlilik Politikası veya veri uygulamalarımız hakkında herhangi bir sorunuz veya endişeniz varsa, lütfen İletişim sayfamız aracılığıyla bize ulaşın.
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
