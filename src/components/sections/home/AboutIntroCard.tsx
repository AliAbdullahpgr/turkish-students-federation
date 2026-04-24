"use client";

import PrimaryButton from "@/components/ui/PrimaryButton";

export default function AboutIntroCard() {
  return (
    <div className="max-w-[760px] mx-auto px-6 lg:px-12 -mt-20 relative z-10">
      <div className="bg-primary rounded-[20px] p-10 lg:p-12 shadow-about-card">
        <span className="text-[13px] font-semibold text-accent uppercase tracking-[2px] block mb-3">
          Who We Are?
        </span>
        <h2 className="text-[28px] lg:text-[32px] font-extrabold text-white mb-4 leading-tight">
          Turkish Student Federation
        </h2>
        <p className="text-[15px] text-white/85 leading-relaxed mb-7">
          Turkish Student Federation is a fast-growing student organization in Turkey, rooted
          in the Ideology of Turkey and driven by a mission to connect youth with
          their identity and purpose. As a student-led platform, we develop young
          minds through Islamic guidance, leadership training, and character
          building, preparing students to lead with confidence.
        </p>
        <PrimaryButton href="/about-us/">Discover More</PrimaryButton>
      </div>
    </div>
  );
}
