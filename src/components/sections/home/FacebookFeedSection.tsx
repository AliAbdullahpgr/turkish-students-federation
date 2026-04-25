"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animation/FadeIn";

export default function FacebookFeedSection() {
  return (
    <section className="py-section bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 text-center">
        <FadeIn className="mb-8">
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Facebook <span className="text-accent">Page</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <motion.div
            whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
            transition={{ duration: 0.3 }}
            className="max-w-[500px] mx-auto bg-white rounded-[16px] p-8 shadow-card"
          >
            <p className="text-text-secondary mb-4">
              Follow us on Facebook for the latest updates and events.
            </p>
            <motion.a
              href="https://facebook.com/tsfturkey"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center bg-[#1877F2] text-white px-6 py-3 rounded-pill text-sm font-semibold no-underline transition-colors hover:bg-[#166fe5]"
            >
              Visit facebook.com/tsfturkey
            </motion.a>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
