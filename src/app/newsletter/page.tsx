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
    title: "TSF Newsletter - April 2026",
    description: "Updates on upcoming events, new membership benefits, and student success stories.",
    date: "APR 2026",
  },
  {
    id: "2",
    title: "TSF Newsletter - March 2026",
    description: "Highlights from the Leadership Summit and upcoming volunteer opportunities.",
    date: "MAR 2026",
  },
  {
    id: "3",
    title: "TSF Newsletter - February 2026",
    description: "Coverage of the National Student Day celebrations and scholarship announcements.",
    date: "FEB 2026",
  },
  {
    id: "4",
    title: "TSF Newsletter - January 2026",
    description: "New year goals, department updates, and welcome to new members.",
    date: "JAN 2026",
  },
];

export const metadata: Metadata = {
  title: "Newsletter - Turkish Student Federation",
  description:
    "Subscribe to the Turkish Student Federation newsletter. Stay updated with the latest news, events, and student initiatives.",
};

export default function NewsletterPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="TSF Newsletter" accentWord="Newsletter" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="STAY UPDATED" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Subscribe to Our <span className="text-accent">Newsletter</span>
              </h2>
              <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
                Get the latest updates on events, initiatives, and student news delivered directly to your inbox.
              </p>
            </div>

            <div className="max-w-[600px] mx-auto mb-16">
              <div className="bg-surface rounded-[16px] p-8">
                <form className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-accent"
                  />
                  <PrimaryButton type="submit" className="w-full">
                    Subscribe Now
                  </PrimaryButton>
                </form>
                <p className="text-xs text-text-muted text-center mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>

            <div className="text-center mb-12">
              <SectionEyebrow text="ARCHIVE" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Past <span className="text-accent">Newsletters</span>
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
