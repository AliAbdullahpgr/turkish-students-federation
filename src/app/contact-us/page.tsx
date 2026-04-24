import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact US - Turkish Student Federation",
  description:
    "Get in touch with Turkish Student Federation. Submit your inquiry and our team will respond within 24 hours.",
};

export default function ContactUsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Let's Get Connect" accentWord="Connect" />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
