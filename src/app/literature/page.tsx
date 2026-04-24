import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

const literatureItems = [
  {
    id: "1",
    title: "The Students Times",
    description: "Monthly newsletter covering student issues and achievements.",
    type: "Newsletter",
  },
  {
    id: "2",
    title: "TSF Magazine 2025",
    description: "Annual magazine highlighting TSF's year in review.",
    type: "Magazine",
  },
  {
    id: "3",
    title: "Youth Leadership Guide",
    description: "A comprehensive guide for aspiring student leaders.",
    type: "Book",
  },
  {
    id: "4",
    title: "Islamic Studies Workbook",
    description: "Educational workbook for Quran classes and Islamic learning.",
    type: "Workbook",
  },
  {
    id: "5",
    title: "Press Release Archive",
    description: "Collection of all official press releases from Turkish Student Federation.",
    type: "Archive",
  },
  {
    id: "6",
    title: "Annual Report 2025",
    description: "Detailed report on TSF's activities, impact, and finances.",
    type: "Report",
  },
];

export const metadata: Metadata = {
  title: "Literature - Turkish Student Federation",
  description:
    "Explore Turkish Student Federation's literature collection including magazines, newsletters, books, and reports.",
};

export default function LiteraturePage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Literature" accentWord="Literature" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="LIBRARY" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                Our <span className="text-accent">Literature</span> Collection
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {literatureItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface rounded-[16px] p-8 transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase rounded-full mb-4">
                    {item.type}
                  </span>
                  <h3 className="text-lg font-bold text-text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
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
