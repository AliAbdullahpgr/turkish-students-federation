import Image from "next/image";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import PrimaryButton from "@/components/ui/PrimaryButton";

interface CourseItem {
  id: string;
  title: string;
  instructor?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  href: string | null;
}

interface CoursesCarouselSectionProps {
  courses: CourseItem[];
}

export default function CoursesCarouselSection({ courses }: CoursesCarouselSectionProps) {
  return (
    <section className="bg-white py-section">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="mb-12 text-center">
          <SectionEyebrow text="KURSLARIMIZ" />
          <h2 className="text-section-title font-heading font-bold text-text-primary">Kurslarimiz</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.id}
              className="flex h-full flex-col overflow-hidden rounded-[16px] border border-border-custom bg-white shadow-card transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-video overflow-hidden bg-surface">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : null}
              </div>

              <div className="flex flex-grow flex-col p-6">
                <h3 className="mb-1 text-lg font-bold text-text-primary">{course.title}</h3>
                <p className="mb-3 text-sm font-medium text-accent">{course.instructor}</p>
                <p className="mb-4 flex-grow text-sm leading-relaxed text-text-secondary">
                  {course.description}
                </p>
                <PrimaryButton href={course.href ?? "#"} className="self-start px-5 py-2.5 text-xs">
                  Devamini Oku
                </PrimaryButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
