"use client";

import { motion } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function AboutIntroCard() {
  return (
    <div className="max-w-[760px] mx-auto px-6 lg:px-12 -mt-20 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-primary rounded-[20px] p-10 lg:p-12 shadow-about-card"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[13px] font-semibold text-accent uppercase tracking-[2px] block mb-3"
        >
          Who We Are?
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-[28px] lg:text-[32px] font-extrabold text-white mb-4 leading-tight"
        >
          Turkish Student Federation
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-[15px] text-white/85 leading-relaxed mb-7"
        >
          Turkish Student Federation is a fast-growing student organization in Turkey, rooted
          in the Ideology of Turkey and driven by a mission to connect youth with
          their identity and purpose. As a student-led platform, we develop young
          minds through Islamic guidance, leadership training, and character
          building, preparing students to lead with confidence.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <PrimaryButton href="/about-us/">Discover More</PrimaryButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
