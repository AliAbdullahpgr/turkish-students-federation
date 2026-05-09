"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  accentWord: string;
  backgroundImage?: string;
}

export default function PageHero({
  title,
  accentWord,
  backgroundImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80",
}: PageHeroProps) {
  const titleParts = title.split(accentWord);

  return (
    <section
      className="relative w-full h-[320px] flex items-center justify-center rounded-b-[24px] overflow-hidden mb-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      <div className="absolute inset-0 bg-[rgba(7,42,31,0.6)]" />
      <div className="relative z-[2] text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[clamp(32px,5vw,52px)] font-extrabold text-white"
        >
          {titleParts[0]}
          <span className="text-turkish-red">{accentWord}</span>
          {titleParts[1] || ""}
        </motion.h1>
      </div>
    </section>
  );
}
