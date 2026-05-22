"use client";

import Link from "next/link";
import { ReactNode } from "react";

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
    "inline-flex items-center justify-center rounded-pill border-none bg-turkish-red px-8 py-3.5 text-sm font-semibold text-white no-underline transition-colors duration-normal hover:bg-turkish-red-dark hover:shadow-btn";

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
}
