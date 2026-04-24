"use client";

import ImpactCounter from "@/components/ui/ImpactCounter";

export default function ImpactHighlightsSection() {
  return (
    <section className="py-section bg-primary text-center">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <h2 className="text-section-title font-heading font-bold text-white mb-12">
          Impact <span className="text-accent">Highlights</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[900px] mx-auto">
          <ImpactCounter target={50} suffix="+" label="Weekly Quran Classes" format={false} />
          <ImpactCounter
            target={5000}
            suffix="+"
            label="Attendees in Seminars"
          />
          <ImpactCounter target={200} suffix="+" label="Blood Bags Donated" format={false} />
        </div>
      </div>
    </section>
  );
}
