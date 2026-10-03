import { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBarRSC";
import Navigation from "@/components/layout/NavigationRSC";
import Footer from "@/components/layout/FooterRSC";
import PageHero from "@/components/ui/PageHero";
import { getPublishedDepartments } from "@/db/queries/departments";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Birimlerimiz - Pakistan Türk Öğrenci Birliği",
  description:
    "Pakistan Türk Öğrenci Birliği içindeki çeşitli birimleri ve öğrenci topluluğuna hizmet rollerini keşfedin.",
};

export default async function DepartmentsPage() {
  const departments = await getPublishedDepartments();

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Birimlerimiz" accentWord="Birimler" />

        <section className="py-section bg-white border-t border-border-custom">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
            <p className="mb-10 max-w-[60ch] text-body text-text-secondary">
              Öğrenci topluluğuna hizmet etmek ve misyonumuzu ilerletmek için birlikte çalışan özel birimlerimiz.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept) => (
                <Link
                  key={dept.id}
                  href={`/departments/${dept.slug}`}
                  className="block bg-surface rounded-[16px] p-8 transition-all hover:-translate-y-1 text-center border border-border-custom no-underline"
                >
                  <div className="text-4xl mb-4">{dept.icon}</div>
                  <h3 className="text-lg font-bold text-text-primary mb-3">{dept.name}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{dept.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
