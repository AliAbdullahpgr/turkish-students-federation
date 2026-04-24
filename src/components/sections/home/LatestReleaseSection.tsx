"use client";

import SectionEyebrow from "@/components/ui/SectionEyebrow";
import PrimaryButton from "@/components/ui/PrimaryButton";

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function LatestReleaseSection() {
  return (
    <section className="py-section bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionEyebrow text="LATEST RELEASE" />
            <h2 className="text-section-title font-heading font-bold text-text-primary mb-4">
              Taleem Se Takmeel Turkey Ka Safar
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                "Turkish Student Federation",
                "Student Organization",
                "Ex President",
                "Ans Mushi",
                "Seminar",
                "Youth Impact",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <PrimaryButton href="#" className="gap-2">
              <YoutubeIcon className="w-4 h-4" />
              Follow Youtube Channel
            </PrimaryButton>
          </div>
          <div className="aspect-video bg-primary rounded-[16px] flex items-center justify-center">
            <div className="text-center text-white">
              <YoutubeIcon className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <p className="text-lg font-semibold">Featured Video</p>
              <p className="text-sm text-white/70">Taleem Se Takmeel Turkey Ka Safar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
