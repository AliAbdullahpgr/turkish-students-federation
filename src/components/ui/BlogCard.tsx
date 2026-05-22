"use client";

import Image from "next/image";
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
    <article className="group cursor-pointer overflow-hidden rounded-md bg-white shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {thumbnail ? (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}

      <div className="p-5 px-6">
        <span className="mb-2.5 block text-[11px] font-bold uppercase tracking-[1.5px] text-accent">
          {date}
        </span>
        <h3
          className={`mb-2.5 text-[17px] font-bold leading-snug text-text-primary ${
            isTurkish ? "turkish-text" : ""
          }`}
        >
          {title}
        </h3>
        <p
          className={`mb-4 text-sm leading-relaxed text-text-secondary ${
            isTurkish ? "turkish-text" : ""
          }`}
        >
          {excerpt}
        </p>
        <Link
          href={href}
          prefetch={false}
          className="border-b-2 border-accent pb-0.5 text-xs font-bold uppercase tracking-[1.5px] text-primary no-underline transition-colors hover:text-accent"
        >
          READ MORE
        </Link>
      </div>
    </article>
  );
}
