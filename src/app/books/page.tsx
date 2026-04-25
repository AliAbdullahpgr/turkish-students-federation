import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

const books = [
  {
    id: "1",
    title: "Youth Leadership Guide",
    description: "A comprehensive guide for aspiring student leaders covering communication, organization, and advocacy skills.",
    category: "Leadership",
  },
  {
    id: "2",
    title: "Islamic Studies Workbook",
    description: "Educational workbook for Quran classes and Islamic learning designed for university students.",
    category: "Education",
  },
  {
    id: "3",
    title: "Student Activism Handbook",
    description: "A practical handbook on organizing student movements, campaigns, and advocating for student rights.",
    category: "Activism",
  },
  {
    id: "4",
    title: "History of Student Movements in Turkey",
    description: "An in-depth look at the evolution and impact of student organizations throughout Turkish history.",
    category: "History",
  },
  {
    id: "5",
    title: "Effective Study Techniques",
    description: "Research-backed methods to improve academic performance, time management, and exam preparation.",
    category: "Academic",
  },
  {
    id: "6",
    title: "Building Communities",
    description: "Strategies for building strong, inclusive student communities on campus and beyond.",
    category: "Community",
  },
];

export const metadata: Metadata = {
  title: "Books - Turkish Student Federation",
  description:
    "Explore the TSF book collection including leadership guides, educational workbooks, and student activism resources.",
};

export default function BooksPage() {
  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Books Collection" accentWord="Books" />

        <section className="py-section bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="LIBRARY" />
              <h2 className="text-section-title font-heading font-bold text-text-primary">
                TSF <span className="text-accent">Books</span> Collection
              </h2>
              <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
                Discover our curated collection of books focused on leadership, education, activism, and student development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-surface rounded-[16px] p-8 transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase rounded-full mb-4">
                    {book.category}
                  </span>
                  <h3 className="text-lg font-bold text-text-primary mb-3">
                    {book.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {book.description}
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
