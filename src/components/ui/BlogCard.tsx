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
  author?: string;
}

export default function BlogCard({
  date,
  title,
  excerpt,
  href,
  isTurkish = false,
  thumbnail,
  author,
}: BlogCardProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="group block h-full rounded-md text-inherit no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      aria-label={`${title} yazisini oku`}
    >
      <article className="h-full cursor-pointer overflow-hidden rounded-md bg-white shadow-card transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-card-hover">
        <div className="relative aspect-video overflow-hidden bg-primary/10">
          <Image
            src={thumbnail || "/image/group.png"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

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
          {author ? <p className="mb-3 text-xs font-semibold text-primary/75">{author}</p> : null}
          <p
            className={`mb-4 text-sm leading-relaxed text-text-secondary ${
              isTurkish ? "turkish-text" : ""
            }`}
          >
            {excerpt}
          </p>
          <span className="border-b-2 border-accent pb-0.5 text-xs font-bold uppercase tracking-[1.5px] text-primary transition-colors group-hover:text-accent">
            READ MORE
          </span>
        </div>
      </article>
    </Link>
  );
}
