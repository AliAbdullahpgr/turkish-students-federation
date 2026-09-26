const trDate = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * "2026-09-25…" → "25 Eylül 2026". Only the calendar date is read, and it is
 * formatted in UTC, so the server's timezone can never shift it by a day.
 */
export function formatActivityDate(value: string | null | undefined): string | undefined {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return undefined;
  const [, y, m, d] = match;
  return trDate.format(new Date(Date.UTC(Number(y), Number(m) - 1, Number(d))));
}
