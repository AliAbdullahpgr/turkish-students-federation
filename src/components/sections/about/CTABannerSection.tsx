"use client";

import { motion } from "framer-motion";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FadeIn from "@/components/animation/FadeIn";

export default function CTABannerSection() {
  return (
    <section className="py-section bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 text-center">
        <FadeIn>
          <SectionEyebrow text="HAREKETE KATIL" />
          <h2 className="text-section-title font-heading font-bold text-text-primary mb-4">
            Pakistan Türk Öğrenci Birliği&apos;ne Katılın — <span className="text-accent">Geleceği</span> Şekillendirin
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-body text-text-secondary max-w-[600px] mx-auto mb-8">
            İster öğrenci olun, ister mezun veya profesyonel — Pakistan Türk Öğrenci Birliği,
            herkesi açık kollarla karşılar. İlk adımı bugün atın.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <PrimaryButton href="/join-tsf/">Bugün Üye Olun</PrimaryButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <PrimaryButton href="/pakistan-rehberi/" className="bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white">
                Pakistan Rehberini İncele
              </PrimaryButton>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
