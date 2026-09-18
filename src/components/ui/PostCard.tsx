import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  title: string;
  excerpt: string;
  href: string;
  date?: string;
  author?: string;
  category?: string;
  thumbnail?: string;
}

/**
 * A blog card for the homepage grid.
 *
 * With no thumbnail the card drops the media frame entirely and leads with the
 * title instead of reserving an empty box. Two earlier versions got this wrong:
 * one fell back to `/image/group.png`, so four posts with empty image fields
 * looked like four identical uploads, and one drew a tinted panel, which still
 * reads as a picture that failed to load.
 */
export default function PostCard({
  title,
  excerpt,
  href,
  date,
  author,
  category,
  thumbnail,
}: PostCardProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="group block h-full rounded-md text-inherit no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
      aria-label={`${title} yazısını oku`}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-md border border-border-custom bg-white transition-transform duration-300 group-hover:-translate-y-1">
        {thumbnail && (
          <div className="relative aspect-video overflow-hidden bg-primary/5">
            <Image
              src={thumbnail}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className={`flex flex-1 flex-col p-6 ${thumbnail ? "" : "pt-7"}`}>
          {(category || date) && (
            <p className="mb-2 text-[13px] font-semibold text-accent">
              {[category, date].filter(Boolean).join(" · ")}
            </p>
          )}

          {/* Without a picture the title has to carry the card, so it steps up. */}
          <h3
            className={`font-bold leading-snug text-text-primary transition-colors group-hover:text-accent ${
              thumbnail ? "text-[17px]" : "text-[20px]"
            }`}
          >
            {title}
          </h3>

          {author && <p className="mt-2 text-xs font-semibold text-text-muted">{author}</p>}

          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-text-secondary">
            {excerpt}
          </p>

          <span className="mt-4 text-sm font-bold text-accent transition-colors group-hover:text-primary">
            Devamını oku →
          </span>
        </div>
      </article>
    </Link>
  );
}
