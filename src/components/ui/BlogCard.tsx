"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface BlogCardProps {
  date: string;
  title: string;
  excerpt: string;
  href: string;
  isTurkish?: boolean;
  thumbnail?: string;
}

export default function BlogCard({
  date,
  title,
  excerpt,
  href,
  isTurkish = false,
  thumbnail,
}: BlogCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-md overflow-hidden shadow-card group cursor-pointer"
    >
      {thumbnail && (
        <div className="aspect-video overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5 px-6">
        <span className="text-[11px] font-bold text-accent uppercase tracking-[1.5px] block mb-2.5">
          {date}
        </span>
        <h3
          className={`text-[17px] font-bold text-text-primary mb-2.5 leading-snug ${
            isTurkish ? "turkish-text" : ""
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm text-text-secondary leading-relaxed mb-4 ${
            isTurkish ? "turkish-text" : ""
          }`}
        >
          {excerpt}
        </p>
        <Link
          href={href}
          prefetch={false}
          className="text-xs font-bold text-primary uppercase tracking-[1.5px] no-underline border-b-2 border-accent pb-0.5 transition-colors hover:text-accent"
        >
          READ MORE
        </Link>
      </div>
    </motion.article>
  );
}
