"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

export default function WhoWeAreSection() {
  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn>
          <SectionEyebrow text="WHO WE ARE" />
          <h2 className="text-section-title font-heading font-bold text-text-primary mb-8">
            A Movement Built on Ideology, Leadership & Patriotism
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="space-y-6 text-body text-text-secondary leading-relaxed max-w-[900px]">
            <p>
              Turkish Student Federation (Turkish Student Federation) is a growing student
              organization in Turkey dedicated to shaping the future of youth
              through Islamic values, leadership development, and social
              responsibility.
            </p>
            <p>
              Turkish Student Federation is a student-driven platform that works to guide,
              connect, and empower students across colleges and universities. Built
              on a strong foundation of ideology and purpose, the organization
              focuses on developing character, knowledge, and leadership skills
              among young individuals.
            </p>
            <p>
              Through a structured grassroots network, Turkish Student Federation operates at
              institutional, city, and national levels. From campus units to
              regional leadership, students are actively engaged in learning,
              organizing, and serving their communities. This system ensures that
              every member becomes part of a meaningful movement, not just a
              network.
            </p>
            <p>
              At Turkish Student Federation, we believe that real change begins with students. By
              promoting discipline, unity, Islamic awareness, and civic
              responsibility, we prepare a generation that is ready to lead with
              integrity and purpose.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="flex flex-wrap gap-4 mt-8" staggerDelay={0.1}>
          {[
            "Student-Led National Organization",
            "Leadership, Education & Welfare Initiatives",
            "Community Service & Social Impact Programs",
          ].map((item) => (
            <StaggerItem key={item}>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-primary rounded-full text-sm font-semibold"
              >
                <Check className="w-4 h-4 text-accent" />
                {item}
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
