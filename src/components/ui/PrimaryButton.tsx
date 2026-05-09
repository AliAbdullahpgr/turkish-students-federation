"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PrimaryButtonProps {
  href?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function PrimaryButton({
  href,
  children,
  onClick,
  type = "button",
  className = "",
}: PrimaryButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center bg-turkish-red text-white px-8 py-3.5 rounded-pill text-sm font-semibold no-underline border-none cursor-pointer transition-all duration-normal hover:bg-turkish-red-dark hover:shadow-btn";

  const motionProps = {
    whileHover: { scale: 1.03, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  };

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link href={href} className={`${baseClasses} ${className}`}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}