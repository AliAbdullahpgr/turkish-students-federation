"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";
import { guideSourceSections, homeMessaging, siteIdentity } from "@/data/siteContent";

export default function WhoWeAreSection() {
  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn>
          <SectionEyebrow text="BİZ KİMİZ?" />
          <h2 className="text-section-title font-heading font-bold text-text-primary mb-8">
            {siteIdentity.name}
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="space-y-6 text-body text-text-secondary leading-relaxed max-w-[900px]">
            <p>{homeMessaging.aboutIntro}</p>
            <p>
              Bu nedenle web sitesinin ana dili de rehberdir: her bölüm öğrencinin
              Pakistan&apos;a gelmeden önce ve geldikten sonra ihtiyaç duyacağı bilgiye
              ulaşmasını kolaylaştırmak için düzenlenir.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8" staggerDelay={0.08}>
          {guideSourceSections.map((item) => (
            <StaggerItem key={item.title}>
              <motion.a
                href={item.href}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
                className="h-full flex gap-3 p-4 bg-accent/10 text-primary rounded-[12px] no-underline"
              >
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>
                  <span className="block text-sm font-bold">{item.title}</span>
                  <span className="block text-xs text-text-secondary leading-5 mt-1">{item.summary}</span>
                </span>
              </motion.a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
