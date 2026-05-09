"use client";

import { Crown, Shield, Users, TrendingUp, Heart, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

const values = [
  {
    icon: Crown,
    title: "Liderlik",
    description:
      "Vizyon, özgüven ve sorumlulukla liderlik eden öğrenciler yetiştiriyoruz.",
  },
  {
    icon: Shield,
    title: "Dürüstlük",
    description:
      "Her zaman dürüstlük, etik ve doğru olanı yapma ilkelerine bağlıyız.",
  },
  {
    icon: Users,
    title: "Birlik",
    description:
      "Farklılıkların ötesinde öğrencileri bir araya getirerek birlik ve kardeşlik inşa ediyoruz.",
  },
  {
    icon: TrendingUp,
    title: "Gelişim",
    description:
      "Sürekli öğrenmeye, beceri geliştirmeye ve kendini iyileştirmeye odaklanıyoruz.",
  },
  {
    icon: Heart,
    title: "Hizmet",
    description:
      "Şefkat ve eylemle toplumlara yardım etmeye kendimizi adıyoruz.",
  },
  {
    icon: Lightbulb,
    title: "Yenilikçilik",
    description:
      "Öğrencilerin karşılaştığı modern zorlukları çözmek için yaratıcı düşünmeyi teşvik ediyoruz.",
  },
];

export default function CoreValuesSection() {
  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-12">
          <SectionEyebrow text="TEMEL DEĞERLERİMİZ" />
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Temel <span className="text-accent">Değerlerimiz</span>
          </h2>
          <p className="text-body text-text-secondary mt-4 max-w-[700px] mx-auto">
            Pakistan Türk Öğrenci Birliği&apos;nde değerlerimiz, her eylemimizi, her programımızı
            ve desteklediğimiz her öğrenciyi şekillendirir.
          </p>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          staggerDelay={0.1}
        >
          {values.map((value) => (
            <StaggerItem key={value.title}>
              <motion.div
                whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
                transition={{ duration: 0.3 }}
                className="bg-surface rounded-[16px] p-8 text-center h-full"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <value.icon className="w-7 h-7 text-primary" />
                </motion.div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
