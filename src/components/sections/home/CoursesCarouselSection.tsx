import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import PrimaryButton from "@/components/ui/PrimaryButton";
import type { HomeContent } from "@/db/queries/home-sections";

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
  content: HomeContent["courses"];
}

export default function CoursesCarouselSection({ courses, content }: CoursesCarouselSectionProps) {
  return (
    <section className="bg-white py-section border-t border-border-custom">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <SectionHeader title={content.title} lede={content.lede || undefined} />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.id}
              className="flex h-full flex-col overflow-hidden rounded-[16px] border border-border-custom bg-white transition-transform duration-300 hover:-translate-y-1"
            >
              {/* No thumbnail means no media frame — an empty grey box reads as a
                  broken image rather than as a course without a picture. */}
              {course.thumbnail && (
                <div className="relative aspect-video overflow-hidden bg-surface">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}

              <div className={`flex flex-grow flex-col p-6 ${course.thumbnail ? "" : "pt-7"}`}>
                <h3
                  className={`mb-1 font-bold text-text-primary ${
                    course.thumbnail ? "text-lg" : "text-xl"
                  }`}
                >
                  {course.title}
                </h3>
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
