"use client";

import Link from "next/link";

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
    <article className="bg-white rounded-md overflow-hidden shadow-card transition-all duration-normal hover:-translate-y-1 hover:shadow-card-hover group">
      {thumbnail && (
        <div className="aspect-video overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105"
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
    </article>
  );
}
