"use client";

import { motion } from "framer-motion";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import FadeIn from "@/components/animation/FadeIn";

export default function MissionVisionSection() {
  return (
    <section className="py-section bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-12">
          <SectionEyebrow text="OUR PURPOSE" />
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Mission & <span className="text-accent">Vision</span>
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
                Our Mission
              </span>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Shaping Students. Strengthening Turkey.
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">
                To empower students across Turkey through Islamic guidance,
                leadership development, educational support, and community service.
                Turkish Student Federation is committed to developing a
                generation that is disciplined, knowledgeable, and socially
                responsible. We focus on nurturing students who not only succeed
                academically but also contribute positively to society with strong
                character and purpose.
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
                Our Vision
              </span>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                A Responsible Generation for a Better Turkey
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">
                Our vision is to build a leading student organization in Turkey
                that shapes individuals with strong faith, clear direction, and
                leadership qualities. Turkish Student Federation aims to create a united student
                force that promotes knowledge, unity, and service—where every
                student has the opportunity to grow, lead, and contribute to a
                progressive and ethical society.
              </p>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
