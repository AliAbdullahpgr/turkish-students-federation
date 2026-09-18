"use client";

import { motion } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FadeIn from "@/components/animation/FadeIn";
import { YoutubeIcon } from "@/components/ui/SocialIcon";

export interface LatestReleaseSectionProps {
  title: string;
  description: string;
  tags: string[];
  /** Ready-to-use youtube-nocookie embed URL, or null when no video is set. */
  embedUrl: string | null;
  channelUrl: string;
  ctaLabel: string;
}

/**
 * The homepage YouTube block.
 *
 * This section previously rendered a decorative placeholder — a pulsing icon
 * in a box — with a hardcoded title and a CTA pointing at `#`. It now plays
 * the video the admin selected and links to the real channel. The embed URL is
 * derived from the pasted address upstream (see `src/lib/youtube.ts`), so a
 * blank or unparseable value yields `null` here and the panel is dropped
 * rather than shown empty.
 */
export default function LatestReleaseSection({
  title,
  description,
  tags,
  embedUrl,
  channelUrl,
  ctaLabel,
}: LatestReleaseSectionProps) {
  return (
    <section className="py-section bg-white border-t border-border-custom">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div>
              {title && (
                <h2 className="text-section-title font-heading font-bold text-text-primary mb-4">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-body text-text-secondary leading-relaxed mb-6 whitespace-pre-line">
                  {description}
                </p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i, duration: 0.3 }}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-lg"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              )}
              {channelUrl && (
                <PrimaryButton href={channelUrl} className="gap-2">
                  <YoutubeIcon className="w-4 h-4" />
                  {ctaLabel}
                </PrimaryButton>
              )}
            </div>
          </FadeIn>

          {embedUrl && (
            <FadeIn direction="right" delay={0.2}>
              <div className="aspect-video overflow-hidden rounded-[16px] bg-primary border border-border-custom">
                {/*
                  `loading="lazy"` keeps YouTube's player bundle off the
                  critical path — this section sits well below the fold.
                */}
                <iframe
                  src={embedUrl}
                  title={title || "Öne çıkan video"}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
