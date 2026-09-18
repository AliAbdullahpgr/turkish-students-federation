"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animation/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";

export default function FacebookFeedSection() {
  return (
    <section className="py-section bg-white border-t border-border-custom">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn>
          <SectionHeader
            title={<>Facebook <span className="text-accent">Sayfamız</span></>}
          />
        </FadeIn>
        <FadeIn delay={0.2}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="max-w-[500px] bg-white rounded-[16px] p-8 border border-border-custom"
          >
            <p className="text-text-secondary mb-4">
              En son güncellemeler ve etkinlikler için bizi Facebook&apos;tan takip edin.
            </p>
            <motion.a
              href="https://facebook.com/tsfturkey"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center bg-action text-white px-6 py-3 rounded-xl text-sm font-semibold no-underline transition-colors hover:bg-action-dark"
            >
              facebook.com/tsfturkey
            </motion.a>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
