import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

const editions = [
  {
    id: "1",
    title: "The Students Times - April 2026",
    description: "Covering student activism, rising education costs, and upcoming TSF events.",
    date: "APR 2026",
  },
  {
    id: "2",
    title: "The Students Times - March 2026",
    description: "Special edition on leadership development and campus initiatives across Turkey.",
    date: "MAR 2026",
  },
  {
    id: "3",
    title: "The Students Times - February 2026",
    description: "Focus on international student relations and educational policy updates.",
    date: "FEB 2026",
  },
  {
    id: "4",
    title: "The Students Times - January 2026",
    description: "Year opener with goals for 2026 and reflections on the past year's achievements.",
    date: "JAN 2026",
  },
  {
    id: "5",
    title: "The Students Times - December 2025",
    description: "Annual review highlighting major milestones, events, and student success stories.",
    date: "DEC 2025",
  },
  {
    id: "6",
    title: "The Students Times - November 2025",
    description: "In-depth coverage of the National Student Convention and policy discussions.",
    date: "NOV 2025",
  },
];

export const metadata: Metadata = {
  title: "The Students Times - Turkish Student Federation",
  description:
    "Read The Students Times, the official publication of Turkish Student Federation. Stay informed about student issues, events, and achievements.",
};

export default function StudentsTimesPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="The Students Times" accentWord="Students" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="OFFICIAL PUBLICATION" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                The <span className="text-accent">Students</span> Times
              </h2>
              <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
                Our monthly publication dedicated to student issues, achievements, and the voice of the student community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {editions.map((edition) => (
                <div
                  key={edition.id}
                  className="bg-surface rounded-[16px] p-8 transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full mb-4">
                    {edition.date}
                  </span>
                  <h3 className="text-lg font-bold text-text-primary mb-3">
                    {edition.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {edition.description}
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
