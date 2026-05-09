"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import FadeIn from "@/components/animation/FadeIn";

export default function PresidentSection() {
  return (
    <section className="py-section bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left" className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-[280px] h-[350px] lg:w-[350px] lg:h-[420px] rounded-[20px] overflow-hidden shadow-card"
            >
              <Image
                src="/image/leader.png"
                alt="Umar Abbas - President"
                width={350}
                height={420}
                className="w-full h-full object-cover object-top"
              />
            </motion.div>
          </FadeIn>
          <FadeIn direction="right" delay={0.2}>
            <SectionEyebrow text="BAŞKAN" />
            <h2 className="text-section-title font-heading font-bold text-text-primary mb-2">
              Ömer Abbas
            </h2>
            <p className="text-accent font-semibold mb-6">
              Pakistan Türk Öğrenci Birliği Başkanı
            </p>
            <p className="text-body text-text-secondary leading-relaxed">
              Ömer Abbas, 3 Şubat 1999 doğumlu olup 1 Aralık 2025&apos;ten bu yana
              Pakistan Türk Öğrenci Birliği Başkanlığı görevini yürütmektedir.
              Afet Yönetimi alanında yüksek lisans öğrencisi olan Ömer Abbas,
              öğrenci liderliği, toplum hizmetleri ve gençlik çalışmalarında
              aktif rol almaktadır.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
