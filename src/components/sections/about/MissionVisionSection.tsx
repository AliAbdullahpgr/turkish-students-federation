"use client";

import { motion } from "framer-motion";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import FadeIn from "@/components/animation/FadeIn";

export default function MissionVisionSection() {
  return (
    <section className="py-section bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-12">
          <SectionEyebrow text="AMACIMIZ" />
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Misyonumuz ve <span className="text-accent">Vizyonumuz</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <FadeIn direction="left" delay={0.1}>
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[16px] p-8 lg:p-10 shadow-card h-full"
            >
              <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-3">
                Misyonumuz
              </span>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Öğrencilere Destek Oluyoruz, Topluluğu Güçlendiriyoruz
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">
                Pakistan&apos;da eğitim gören Türk öğrencilere rehberlik, kardeşlik ve akademik destek sağlayarak
                onların hem eğitim hayatlarını kolaylaştırmak hem de kişisel gelişimlerine katkıda bulunmak.
                Pakistan Türk Öğrenci Birliği, disiplinli, bilgili ve sosyal sorumluluk sahibi bir nesil
                yetiştirmeye kendini adamıştır. Sadece akademik başarı değil, aynı zamanda güçlü karakter
                ve amaç bilinciyle topluma olumlu katkı sağlayan öğrenciler yetiştirmeyi hedefliyoruz.
              </p>
            </motion.div>
          </FadeIn>

          {/* Vision Card */}
          <FadeIn direction="right" delay={0.2}>
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[16px] p-8 lg:p-10 shadow-card h-full"
            >
              <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-3">
                Vizyonumuz
              </span>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Pakistan&apos;daki Türk Öğrencilerin Güvenilir Adresi
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">
                Vizyonumuz, Pakistan&apos;daki Türk öğrenci topluluğunun her üyesine kapsamlı destek sunan
                öncü bir öğrenci birliği olmaktır. Güçlü iman, net vizyon ve liderlik vasıflarıyla donanmış
                bireyler yetiştirerek bilgi, birlik ve hizmeti teşvik eden bir öğrenci gücü oluşturmayı
                amaçlıyoruz. Her öğrencinin büyüme, liderlik ve topluma katkı fırsatına sahip olduğu
                bir ortam inşa etmek istiyoruz.
              </p>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
