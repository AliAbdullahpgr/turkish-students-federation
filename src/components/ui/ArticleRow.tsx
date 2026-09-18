import Image from "next/image";
import Link from "next/link";
import { readingTime } from "@/lib/reading-time";

interface ArticleRowProps {
  title: string;
  excerpt: string;
  href: string;
  date?: string;
  author?: string;
  category?: string;
  thumbnail?: string;
  isTurkish?: boolean;
}

/**
 * A feed row for the article listings: text on the left, a small thumbnail on
 * the right, rows separated by a hairline.
 *
 * Deliberately not a card — no tint, no border box and no shadow. A list of
 * things to read should read as a list, so the only vertical rhythm comes from
 * the separators between rows.
 */
export default function ArticleRow({
  title,
  excerpt,
  href,
  date,
  author,
  category,
  thumbnail,
  isTurkish = false,
}: ArticleRowProps) {
  const minutes = readingTime(excerpt || "");
  const meta = [category, date, minutes ? `${minutes} dk okuma` : null].filter(Boolean);

  return (
    <Link
      href={href}
      prefetch={false}
      className="group block border-b border-border-custom py-8 text-inherit no-underline first:pt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      aria-label={`${title} yazısını oku`}
    >
      <article className="flex items-start gap-6 sm:gap-10">
        <div className="min-w-0 flex-1">
          {author && (
            <p className="mb-2 truncate text-[13px] font-semibold text-text-primary">{author}</p>
          )}

          <h3
            className={`text-[clamp(18px,2.2vw,22px)] font-bold leading-snug text-text-primary transition-colors group-hover:text-accent ${
              isTurkish ? "turkish-text" : ""
            }`}
          >
            {title}
          </h3>

          <p
            className={`mt-2 line-clamp-2 text-[15px] leading-relaxed text-text-secondary ${
              isTurkish ? "turkish-text" : ""
            }`}
          >
            {excerpt}
          </p>

          {meta.length > 0 && (
            <p className="mt-3 text-[13px] text-text-muted">{meta.join(" · ")}</p>
          )}
        </div>

        {thumbnail && (
          <div className="relative aspect-[4/3] w-[110px] shrink-0 overflow-hidden rounded-md bg-primary/5 sm:w-[160px]">
            <Image
              src={thumbnail}
              alt=""
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
        )}
      </article>
    </Link>
  );
}
