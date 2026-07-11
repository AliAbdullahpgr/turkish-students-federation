"use client";

import { motion } from "framer-motion";

export default function AnnouncementBar() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-primary-light text-white flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-2 text-[12px] sm:text-[13px] font-medium sticky top-0 z-[1000] text-center"
    >
      <span>Pakistan&apos;daki Türk öğrencilerin buluşma noktası</span>
    </motion.div>
  );
}
