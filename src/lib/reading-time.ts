/**
 * Rough reading time in minutes, for the byline on long-form pages.
 *
 * Markdown syntax is stripped first so fences, link targets and image
 * references do not inflate the count. Returns 0 for empty input so the caller
 * can drop the "· N dk okuma" clause entirely rather than print "0 dk".
 */
const WORDS_PER_MINUTE = 200;

export function readingTime(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]/g, " ");

  const words = text.split(/\s+/).filter(Boolean).length;
  return words ? Math.max(1, Math.round(words / WORDS_PER_MINUTE)) : 0;
}
