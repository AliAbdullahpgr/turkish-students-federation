"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/image/group.png')" }}
    >
      <div className="absolute inset-0 bg-[rgba(7,42,31,0.65)]" />
      <div className="relative z-[2] text-center px-6">
        <h1 className="font-heading">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="block text-[clamp(64px,10vw,120px)] font-black text-white tracking-[-2px] leading-none uppercase"
          >
            LEADERS
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-block max-w-[calc(100vw-2rem)] bg-primary text-white text-[26px] sm:text-[clamp(32px,5vw,64px)] font-extrabold px-6 sm:px-10 py-3 uppercase mt-4 whitespace-nowrap"
            style={{ clipPath: "polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)" }}
          >
            IN THE MAKING
          </motion.span>
        </h1>
      </div>
      {/* Pakistan flag graphic placeholder */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 z-[2] hidden md:block"
      >
        <div className="w-20 h-28 lg:w-28 lg:h-40 bg-[#0B3D2E] rounded-sm flex items-center justify-center shadow-lg">
          <div className="w-16 h-20 lg:w-24 lg:h-28 bg-white rounded-sm flex items-center justify-center">
            <span className="text-primary text-4xl lg:text-6xl font-bold">*</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
