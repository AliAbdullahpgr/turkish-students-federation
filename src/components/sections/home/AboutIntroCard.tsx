"use client";

import { motion } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";

interface HomeMessaging {
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  summary: string;
  primaryCta: string;
  secondaryCta: string;
  aboutIntro: string;
}

interface SiteIdentity {
  name: string;
  shortName: string;
  guideName: string;
  guideHref: string;
  joinHref: string;
  description: string;
  guideDescription: string;
}

interface AboutIntroCardProps {
  messaging: HomeMessaging;
  identity: SiteIdentity;
}

export default function AboutIntroCard({ messaging, identity }: AboutIntroCardProps) {
  return (
    <div className="max-w-[900px] mx-auto px-6 lg:px-12 -mt-20 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-primary rounded-[20px] p-8 lg:p-12 shadow-about-card"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[13px] font-semibold text-turkish-red uppercase tracking-[2px] block mb-3"
        >
          Rehberden Alıntı
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-[28px] lg:text-[34px] font-extrabold text-white mb-4 leading-tight"
        >
          {identity.name}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-[15px] text-white/85 leading-relaxed mb-7"
        >
          {messaging.aboutIntro}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap gap-3"
        >
          <PrimaryButton href={identity.guideHref} className="bg-accent text-primary-dark hover:bg-accent-light">
            Rehberin Tamamı
          </PrimaryButton>
          <PrimaryButton href="/about-us/" className="bg-white/10 hover:bg-white/15">
            Hakkımızda
          </PrimaryButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
