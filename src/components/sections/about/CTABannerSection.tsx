"use client";

import SectionEyebrow from "@/components/ui/SectionEyebrow";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function CTABannerSection() {
  return (
    <section className="py-section bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 text-center">
        <SectionEyebrow text="BE PART OF THE MOVEMENT" />
        <h2 className="text-section-title font-heading font-bold text-text-primary mb-4">
          Join Turkish Student Federation - Shape the <span className="text-accent">Future</span>
        </h2>
        <p className="text-body text-text-secondary max-w-[600px] mx-auto mb-8">
          Whether you are a student, graduate, or professional - Turkish Student Federation
          welcomes every patriot who believes in Turkey&apos;s potential. Take the
          first step today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <PrimaryButton href="/join-tsf/">Become a Member Today</PrimaryButton>
          <PrimaryButton href="https://tsfturkey.org" className="bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white">
            Visit tsfturkey.org
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
