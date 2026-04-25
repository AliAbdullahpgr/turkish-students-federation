import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

const departments = [
  {
    id: "1",
    name: "Media & Publications",
    description:
      "Responsible for managing TSF's digital presence, social media, newsletters, and official publications. Ensures effective communication with students and the public.",
    icon: "📢",
  },
  {
    id: "2",
    name: "Student Welfare",
    description:
      "Focuses on student wellbeing, financial assistance programs, mental health initiatives, and support services for students in need.",
    icon: "🤝",
  },
  {
    id: "3",
    name: "Islamic Education",
    description:
      "Organizes Quran classes, Islamic studies workshops, and spiritual development programs for students seeking religious education.",
    icon: "📖",
  },
  {
    id: "4",
    name: "Event Management",
    description:
      "Plans and executes conferences, seminars, cultural events, and student gatherings at local and national levels.",
    icon: "🎉",
  },
  {
    id: "5",
    name: "Research & Development",
    description:
      "Promotes academic research, innovation, and collaboration between students and faculty members across various disciplines.",
    icon: "🔬",
  },
  {
    id: "6",
    name: "International Relations",
    description:
      "Builds connections with student organizations worldwide, manages exchange programs, and represents TSF at international forums.",
    icon: "🌍",
  },
];

export const metadata: Metadata = {
  title: "Our Departments - Turkish Student Federation",
  description:
    "Explore the various departments within Turkish Student Federation and their roles in serving the student community.",
};

export default function DepartmentsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Our Departments" accentWord="Departments" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="ORGANIZATIONAL STRUCTURE" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                TSF <span className="text-accent">Departments</span>
              </h2>
              <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
                Our dedicated departments work together to serve the student community and advance our mission.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="bg-surface rounded-[16px] p-8 transition-all hover:-translate-y-1 hover:shadow-card-hover text-center"
                >
                  <div className="text-4xl mb-4">{dept.icon}</div>
                  <h3 className="text-lg font-bold text-text-primary mb-3">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {dept.description}
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
