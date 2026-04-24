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
    "inline-flex items-center justify-center bg-primary text-white px-8 py-3.5 rounded-pill text-sm font-semibold no-underline border-none cursor-pointer transition-all duration-normal hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-btn active:translate-y-0";

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
}
