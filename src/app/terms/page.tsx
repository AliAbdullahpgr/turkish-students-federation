import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

export const metadata: Metadata = {
  title: "Terms & Conditions - Turkish Student Federation",
  description:
    "Terms and conditions for using the Turkish Student Federation website and services.",
};

export default function TermsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Terms & Conditions" accentWord="Conditions" />

        <section className="py-section bg-white">
          <div className="max-w-[800px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="LEGAL" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Terms & <span className="text-accent">Conditions</span>
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">1. Introduction</h3>
                <p className="text-sm leading-relaxed">
                  Welcome to Turkish Student Federation (TSF). By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">2. Use of Website</h3>
                <p className="text-sm leading-relaxed">
                  The content of this website is for your general information and use only. It is subject to change without notice. Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">3. Membership</h3>
                <p className="text-sm leading-relaxed">
                  TSF membership is open to all students who share our values and mission. Members are expected to uphold the organization&apos;s principles and act in accordance with our code of conduct.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">4. Intellectual Property</h3>
                <p className="text-sm leading-relaxed">
                  All content on this website, including but not limited to text, graphics, logos, and images, is the property of Turkish Student Federation and is protected by copyright laws.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">5. Limitation of Liability</h3>
                <p className="text-sm leading-relaxed">
                  Turkish Student Federation shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">6. Governing Law</h3>
                <p className="text-sm leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of the Republic of Turkey. Any disputes shall be subject to the exclusive jurisdiction of the courts of Turkey.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">7. Changes to Terms</h3>
                <p className="text-sm leading-relaxed">
                  Turkish Student Federation reserves the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website following any changes constitutes acceptance of those changes.
                </p>
              </div>

              <div className="bg-surface rounded-[16px] p-8">
                <h3 className="text-lg font-bold text-text-primary mb-3">8. Contact Information</h3>
                <p className="text-sm leading-relaxed">
                  If you have any questions about these Terms & Conditions, please contact us through our Contact Us page or email us at info@tsfturkey.org.
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
