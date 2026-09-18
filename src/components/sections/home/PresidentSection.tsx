"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/components/animation/FadeIn";

export interface PresidentSectionProps {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  imageAlt: string;
}

/**
 * Every field here used to be a literal, which is why the admin panel offered
 * no way to change the president. The copy now arrives from `site_settings`
 * via `getPresidentSection()`; the section is omitted upstream when it is
 * turned off, so this component always has something to render.
 */
export default function PresidentSection({
  name,
  role,
  bio,
  imageUrl,
  imageAlt,
}: PresidentSectionProps) {
  return (
    <section className="py-section bg-white border-t border-border-custom">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {imageUrl && (
            <FadeIn direction="left" className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="w-[280px] h-[350px] lg:w-[350px] lg:h-[420px] rounded-[20px] overflow-hidden border border-border-custom"
              >
                <Image
                  src={imageUrl}
                  alt={imageAlt || name}
                  width={350}
                  height={420}
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
            </FadeIn>
          )}
          <FadeIn direction="right" delay={0.2}>
            <h2 className="text-section-title font-heading font-bold text-text-primary mb-2">
              {name}
            </h2>
            <p className="text-accent font-semibold mb-6">{role}</p>
            {bio && (
              /*
                `whitespace-pre-line` so an editor's paragraph breaks in the
                admin textarea survive to the page — without it the whole
                message collapses into one block.
              */
              <p className="text-body text-text-secondary leading-relaxed whitespace-pre-line">
                {bio}
              </p>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
