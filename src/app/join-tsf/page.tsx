import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import JoinForm from "./JoinForm";

export const metadata: Metadata = {
  title: "Bize Katıl - Pakistan Türk Öğrenci Birliği",
};

export default function JoinTSFPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Pakistan Türk Öğrenci Birliği'ne Katılın" accentWord="Katılın" />

        <section className="py-section bg-white border-t border-border-custom">
          <div className="max-w-[800px] mx-auto px-6 lg:px-12">
            <SectionHeader
              title={<>Harekete <span className="text-accent">Katıl</span></>}
              lede="Pakistan Türk Öğrenci Birliği'nin bir parçası olun. Aşağıdaki formu doldurun, ekibimiz size ulaşacaktır."
            />

            <JoinForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
