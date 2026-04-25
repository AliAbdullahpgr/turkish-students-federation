import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

export const metadata: Metadata = {
  title: "Privacy Policy - Turkish Student Federation",
  description:
    "Privacy policy for Turkish Student Federation website. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Privacy Policy" accentWord="Privacy" />

        <section className="py-section bg-white">
          <div className="max-w-[800px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="DATA PROTECTION" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Privacy <span className="text-accent">Policy</span>
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">1. Information We Collect</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Turkish Student Federation collects personal information that you voluntarily provide when registering for membership, subscribing to newsletters, or contacting us. This may include your name, email address, phone number, and institutional affiliation.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">2. How We Use Your Information</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  We use the information we collect to communicate with you about TSF activities, process your membership application, send newsletters and updates, and improve our services. We do not sell or rent your personal information to third parties.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">3. Data Security</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">4. Cookies</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect the functionality of certain features on our website.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">5. Third-Party Links</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">6. Your Rights</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  You have the right to access, correct, or delete your personal information. You may also withdraw your consent for us to process your data at any time. To exercise these rights, please contact us using the information provided on our Contact Us page.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">7. Changes to This Policy</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">8. Contact Us</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us through our Contact Us page.
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
