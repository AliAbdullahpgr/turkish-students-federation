"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface AnnouncementBarProps {
  guideName: string;
  guideHref: string;
}

export default function AnnouncementBar({ guideName, guideHref }: AnnouncementBarProps) {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-primary-light text-white flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-2 text-[12px] sm:text-[13px] font-medium sticky top-0 z-[1000] text-center"
    >
      <span>{guideName}: Pakistan&apos;a hazırlanan Türk öğrenciler için ana kaynak</span>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href={guideHref}
          className="bg-transparent border-[1.5px] border-white text-white px-4 py-1 rounded-pill text-xs font-bold uppercase tracking-wider no-underline transition-all duration-fast hover:bg-turkish-red hover:border-turkish-red hover:text-white"
        >
          REHBERİ AÇ
        </Link>
      </motion.div>
    </motion.div>
  );
}
