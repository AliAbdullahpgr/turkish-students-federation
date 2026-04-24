"use client";

import { Crown, Shield, Users, TrendingUp, Heart, Lightbulb } from "lucide-react";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

const values = [
  {
    icon: Crown,
    title: "Leadership",
    description:
      "We raise students who lead with vision, confidence, and responsibility.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "We stand for honesty, ethics, and doing the right thing—always.",
  },
  {
    icon: Users,
    title: "Unity",
    description:
      "We connect students beyond differences to build unity and brotherhood.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description:
      "We focus on continuous learning, skill development, and self-improvement.",
  },
  {
    icon: Heart,
    title: "Service",
    description:
      "We dedicate ourselves to helping communities with compassion and action.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We encourage creative thinking to solve modern challenges faced by students.",
  },
];

export default function CoreValuesSection() {
  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <SectionEyebrow text="WHAT WE STAND FOR" />
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Our Core <span className="text-accent">Values</span>
          </h2>
          <p className="text-body text-text-secondary mt-4 max-w-[700px] mx-auto">
            At Turkish Student Federation (Turkish Student Federation), our values shape
            every action, every program, and every student we empower.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-surface rounded-[16px] p-8 text-center transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <value.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-3">
                {value.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
