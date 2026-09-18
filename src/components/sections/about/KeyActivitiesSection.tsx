"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import ActivityCard from "@/components/ui/ActivityCard";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

interface ActivityItem {
  id: string;
  title: string;
  description: string | null;
  icon: string;
}

interface KeyActivitiesSectionProps {
  activities: ActivityItem[];
}

export default function KeyActivitiesSection({ activities }: KeyActivitiesSectionProps) {
  return (
    <section className="py-section bg-white border-t border-border-custom">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn>
          <SectionHeader
            title={<>Temel <span className="text-accent">Faaliyetlerimiz</span></>}
            lede="Yerel topluluk çalışmalarından ulusal çapta büyük etkinliklere kadar — işte etki yaratma şeklimiz."
          />
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
