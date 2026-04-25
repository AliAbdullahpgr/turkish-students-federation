"use client";

import ImpactCounter from "@/components/ui/ImpactCounter";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

const stats = [
  { target: 50000, suffix: "+", label: "Active Members" },
  { target: 100, suffix: "+", label: "Districts Covered", format: false },
  { target: 500, suffix: "+", label: "Events Conducted", format: false },
  { target: 200, suffix: "+", label: "Chapters Nationwide", format: false },
];

export default function ImpactNumbersSection() {
  return (
    <section className="py-section bg-primary text-center">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn className="mb-12">
          <SectionEyebrow text="OUR IMPACT" />
          <h2 className="text-section-title font-heading font-bold text-white">
            Numbers That Tell the <span className="text-accent">Story</span>
          </h2>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          staggerDelay={0.15}
        >
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <ImpactCounter
                target={stat.target}
                suffix={stat.suffix}
                label={stat.label}
                format={stat.format !== false}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
