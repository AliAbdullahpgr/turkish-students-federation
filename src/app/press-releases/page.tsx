import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

const pressReleases = [
  {
    id: "1",
    title: "TSF Announces New Leadership Structure for 2026",
    date: "JAN 15, 2026",
    excerpt:
      "Turkish Student Federation is pleased to announce a restructured leadership model aimed at better serving students across all regions of Turkey.",
  },
  {
    id: "2",
    title: "Student Welfare Initiative Launched Nationwide",
    date: "DEC 28, 2025",
    excerpt:
      "A new nationwide student welfare initiative has been launched to provide support and resources to students facing economic challenges.",
  },
  {
    id: "3",
    title: "TSF Partners with Local Universities for Research Programs",
    date: "DEC 10, 2025",
    excerpt:
      "Turkish Student Federation has established partnerships with leading universities to foster research and innovation among students.",
  },
  {
    id: "4",
    title: "Annual Student Convention Dates Announced",
    date: "NOV 22, 2025",
    excerpt:
      "The annual TSF Student Convention will take place in Istanbul next summer, bringing together students from across the country.",
  },
  {
    id: "5",
    title: "TSF Launches Digital Learning Platform",
    date: "NOV 05, 2025",
    excerpt:
      "A new digital learning platform has been launched to provide students with access to educational resources and online courses.",
  },
  {
    id: "6",
    title: "Solidarity Fund for Students in Need",
    date: "OCT 18, 2025",
    excerpt:
      "Turkish Student Federation has established a solidarity fund to support students facing financial hardship during their academic journey.",
  },
];

export const metadata: Metadata = {
  title: "Press Releases - Turkish Student Federation",
  description:
    "Official press releases from Turkish Student Federation. Stay updated with our latest announcements and initiatives.",
};

export default function PressReleasesPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Press Releases" accentWord="Releases" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="OFFICIAL STATEMENTS" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Latest <span className="text-accent">Press</span> Releases
              </h2>
              <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
                Stay informed with the latest announcements, initiatives, and official statements from Turkish Student Federation.
              </p>
            </div>

            <div className="space-y-6">
              {pressReleases.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface rounded-[16px] p-6 lg:p-8 transition-all hover:-translate-y-1 hover:shadow-card-hover border-l-4 border-accent"
                >
                  <span className="text-[11px] font-bold text-accent uppercase tracking-[1.5px] block mb-3">
                    {item.date}
                  </span>
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.excerpt}
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
