"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AnnouncementBar() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-primary-light text-white flex items-center justify-center gap-4 px-6 py-2 text-[13px] font-medium sticky top-0 z-[1000]"
    >
      <span>Join the movement — Turkish Student Federation</span>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/join-tsf/"
          className="bg-transparent border-[1.5px] border-white text-white px-4 py-1 rounded-pill text-xs font-bold uppercase tracking-wider no-underline transition-all duration-fast hover:bg-white hover:text-primary-light"
        >
          JOIN US
        </Link>
      </motion.div>
    </motion.div>
  );
}
