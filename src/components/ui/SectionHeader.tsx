import Link from "next/link";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: ReactNode;
  /** Optional lede, sits under the title. Keep it to a sentence or two. */
  lede?: ReactNode;
  /** Optional "view all" style action, rendered on the title's baseline. */
  action?: { href: string; label: string };
  /** id for the <h2>, for sections using aria-labelledby. */
  titleId?: string;
  className?: string;
}

/**
 * The one section header for the public site.
 *
 * Title and its optional action share a single baseline, with the lede below.
 * There is deliberately no eyebrow: the tracked uppercase kicker that used to
 * sit above each heading restated the heading in a more generic word and put a
 * second thing to read before the real one. Do not reintroduce it.
 */
export default function SectionHeader({
  title,
  lede,
  action,
  titleId,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id={titleId} className="text-section-title font-heading font-bold text-text-primary">
          {title}
        </h2>
        {action && (
          <Link
            href={action.href}
            className="inline-flex min-h-[24px] items-center py-1 text-sm font-bold text-accent transition-colors hover:text-primary"
          >
            {action.label}
          </Link>
        )}
      </div>
      {lede && (
        <p className="text-body text-text-secondary mt-3 max-w-[60ch]">{lede}</p>
      )}
    </div>
  );
}
