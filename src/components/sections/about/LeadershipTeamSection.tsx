"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import { teamMembers } from "@/data/team";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import TeamCard from "@/components/ui/TeamCard";
import FadeIn from "@/components/animation/FadeIn";

export default function LeadershipTeamSection() {
  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-12">
          <SectionEyebrow text="EKİP" />
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Proje <span className="text-accent">Ekibimiz</span>
          </h2>
          <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
            Kararlı, adanmış ve öğrenci topluluğuna derinden bağlı —
            Pakistan Öğrenci Rehberi&apos;ni hazırlayan ekiple tanışın.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="relative overflow-hidden sm:overflow-visible">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                prevEl: ".team-prev",
                nextEl: ".team-next",
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-4"
            >
              {teamMembers.map((member) => (
                <SwiperSlide key={member.id}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TeamCard
                      photo={member.photo}
                      name={member.name}
                      role={member.role}
                      bio={member.bio}
                    />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="team-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 hidden sm:flex w-10 h-10 rounded-full bg-primary text-white items-center justify-center shadow-lg hover:bg-primary-dark transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="team-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 hidden sm:flex w-10 h-10 rounded-full bg-primary text-white items-center justify-center shadow-lg hover:bg-primary-dark transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
