"use client";

import { activities } from "@/data/activities";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import ActivityCard from "@/components/ui/ActivityCard";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

export default function KeyActivitiesSection() {
  return (
    <section className="py-section bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-12">
          <SectionEyebrow text="NE YAPIYORUZ" />
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Temel <span className="text-accent">Faaliyetlerimiz</span>
          </h2>
          <p className="text-body text-text-secondary mt-4 max-w-[600px] mx-auto">
            Yerel topluluk çalışmalarından ulusal çapta büyük etkinliklere kadar —
            işte etki yaratma şeklimiz.
          </p>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          staggerDelay={0.1}
        >
          {activities.map((activity) => (
            <StaggerItem key={activity.id}>
              <ActivityCard
                icon={activity.icon}
                title={activity.title}
                description={activity.description}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
