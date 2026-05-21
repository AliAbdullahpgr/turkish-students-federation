import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "İletişim - Pakistan Türk Öğrenci Birliği",
  description:
    "Pakistan Türk Öğrenci Birliği ile iletişime geçin. Sorularınızı gönderin, ekibimiz 24 saat içinde yanıt verecektir.",
};

export default function ContactUsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Bize Ulaşın" accentWord="Ulaşın" />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
