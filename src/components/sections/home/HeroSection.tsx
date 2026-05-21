"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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

interface HeroSectionProps {
  messaging: HomeMessaging;
  identity: SiteIdentity;
}

export default function HeroSection({ messaging, identity }: HeroSectionProps) {
  return (
    <section
      className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/image/group.png')" }}
    >
      <div className="absolute inset-0 bg-[rgba(7,42,31,0.75)]" />

      <div className="relative z-[2] w-full max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="max-w-[700px]">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(40px,7vw,84px)] font-black text-white leading-[1.05] uppercase tracking-tight"
          >
            {messaging.titleTop}{" "}
            <span className="text-turkish-red">{messaging.titleBottom}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-[560px] text-[17px] leading-7 text-white/80 mt-6"
          >
            {messaging.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8"
          >
            <Link
              href={identity.guideHref}
              className="inline-flex items-center gap-2 bg-turkish-red text-white px-7 py-3.5 rounded-pill text-sm font-bold no-underline transition-all hover:bg-turkish-red-dark"
            >
              {messaging.primaryCta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
