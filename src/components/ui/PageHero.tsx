"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  accentWord: string;
  backgroundImage?: string;
}

/**
 * The banner at the top of a section page.
 *
 * The band paints `bg-primary` itself and the photo sits on top of it, so a
 * missing, slow or blocked image degrades to the brand green rather than to an
 * overlay over white — which is what a remote stock photo used to do here, and
 * it left the title at roughly 2:1 against a washed grey-green.
 */
export default function PageHero({
  title,
  accentWord,
  backgroundImage = "/image/association-community-evening.png",
}: PageHeroProps) {
  const index = accentWord ? title.indexOf(accentWord) : -1;
  const hasAccent = index !== -1 && accentWord !== title;
  const before = hasAccent ? title.slice(0, index) : title;
  const after = hasAccent ? title.slice(index + accentWord.length) : "";

  return (
    <section className="relative mb-12 flex h-[260px] w-full items-center justify-center overflow-hidden rounded-b-[24px] bg-primary">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      )}
      <div className="absolute inset-0 bg-primary/75" />
      <div className="relative z-[2] px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[clamp(30px,4.5vw,46px)] font-extrabold tracking-[-0.02em] text-white"
        >
          {before}
          {hasAccent && <span className="text-accent-light">{accentWord}</span>}
          {after}
        </motion.h1>
      </div>
    </section>
  );
}
