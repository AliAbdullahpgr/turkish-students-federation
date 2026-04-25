"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  amount?: number;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: { delay: number; duration: number; y: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration,
      delay: custom.delay,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  y = 30,
  once = true,
  amount = 0.2,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={fadeInUp}
      custom={{ delay, duration, y }}
    >
      {children}
    </motion.div>
  );
}
