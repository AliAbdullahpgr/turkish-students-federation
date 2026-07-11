"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface PrimaryButtonProps {
  href?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export default function PrimaryButton({
  href,
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: PrimaryButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-pill border-none bg-action px-8 py-3.5 text-sm font-semibold text-white no-underline transition-colors duration-normal hover:bg-action-dark hover:shadow-btn";

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseClasses} disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>
      {children}
    </button>
  );
}
