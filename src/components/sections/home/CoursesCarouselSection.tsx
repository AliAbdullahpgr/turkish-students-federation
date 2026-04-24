"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import { courses } from "@/data/courses";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function CoursesCarouselSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <SectionEyebrow text="EXPLORE COURSES" />
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Our <span className="text-accent">Courses</span>
          </h2>
        </div>

        <div className="relative">
          <Swiper
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            className="overflow-visible! pb-4"
          >
            {courses.map((course) => (
              <SwiperSlide key={course.id}>
                <div className="bg-white rounded-[16px] overflow-hidden shadow-card border border-border-custom flex flex-col h-full">
                  <div className="aspect-video bg-surface overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-accent font-medium mb-3">
                      {course.instructor}
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-grow">
                      {course.description}
                    </p>
                    <PrimaryButton href={course.href} className="self-start text-xs py-2.5 px-5">
                      Read More
                    </PrimaryButton>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 hidden sm:flex w-10 h-10 rounded-full bg-primary text-white items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 hidden sm:flex w-10 h-10 rounded-full bg-primary text-white items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
