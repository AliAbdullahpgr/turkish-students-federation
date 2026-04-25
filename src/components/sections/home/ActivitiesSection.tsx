"use client";

import { activities } from "@/data/activities";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import ActivityCard from "@/components/ui/ActivityCard";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

export default function ActivitiesSection() {
  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-12">
          <SectionEyebrow text="OUR ACTIVITIES" />
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            What We <span className="text-accent">Do?</span>
          </h2>
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
