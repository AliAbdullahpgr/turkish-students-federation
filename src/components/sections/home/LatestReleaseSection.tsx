"use client";

import { motion } from "framer-motion";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FadeIn from "@/components/animation/FadeIn";

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
          <FadeIn direction="left">
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
                ].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.3 }}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
              <PrimaryButton href="#" className="gap-2">
                <YoutubeIcon className="w-4 h-4" />
                Follow Youtube Channel
              </PrimaryButton>
            </div>
          </FadeIn>
          <FadeIn direction="right" delay={0.2}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="aspect-video bg-primary rounded-[16px] flex items-center justify-center cursor-pointer"
            >
              <div className="text-center text-white">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <YoutubeIcon className="w-16 h-16 mx-auto mb-4 opacity-80" />
                </motion.div>
                <p className="text-lg font-semibold">Featured Video</p>
                <p className="text-sm text-white/70">Taleem Se Takmeel Turkey Ka Safar</p>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
