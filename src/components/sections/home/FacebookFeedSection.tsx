"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/animation/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import type { HomeContent } from "@/db/queries/home-sections";

interface FacebookFeedSectionProps {
  content: HomeContent["facebook"];
}

/**
 * The heading, body, address and button label were all literals, including the
 * facebook.com/tsfturkey URL in two places — so changing the page meant a code
 * change in both. It is one field now, shown on the button when the editor
 * leaves the label blank.
 */
export default function FacebookFeedSection({ content }: FacebookFeedSectionProps) {
  return (
    <section className="py-section bg-white border-t border-border-custom">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn>
          <SectionHeader title={content.title} />
        </FadeIn>
        <FadeIn delay={0.2}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="max-w-[500px] bg-white rounded-[16px] p-8 border border-border-custom"
          >
            {content.body && <p className="text-text-secondary mb-4">{content.body}</p>}
            {content.url && (
              <motion.a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center bg-action text-white px-6 py-3 rounded-xl text-sm font-semibold no-underline transition-colors hover:bg-action-dark"
              >
                {content.cta || content.url.replace(/^https?:\/\//, "")}
              </motion.a>
            )}
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
