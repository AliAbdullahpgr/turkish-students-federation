"use client";

import ImpactCounter from "@/components/ui/ImpactCounter";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

export default function ImpactHighlightsSection() {
  return (
    <section className="py-section bg-primary text-center">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn className="mb-12">
          <h2 className="text-section-title font-heading font-bold text-white">
            Impact <span className="text-accent">Highlights</span>
          </h2>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[900px] mx-auto"
          staggerDelay={0.15}
        >
          <StaggerItem>
            <ImpactCounter target={50} suffix="+" label="Weekly Quran Classes" format={false} />
          </StaggerItem>
          <StaggerItem>
            <ImpactCounter
              target={5000}
              suffix="+"
              label="Attendees in Seminars"
            />
          </StaggerItem>
          <StaggerItem>
            <ImpactCounter target={200} suffix="+" label="Blood Bags Donated" format={false} />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
