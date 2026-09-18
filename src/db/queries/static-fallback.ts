/**
 * Static content is useful for first-time local setup, but must not hide a
 * schema or query problem when a database has been configured.
 *
 * A *reachability* failure is different: if Turso times out or returns a 5xx,
 * the data is fine and the network is not, so a public page should render its
 * last-known-good static content rather than 500. A malformed query, a missing
 * column or an auth rejection still throws, because those are bugs that must be
 * seen rather than silently papered over with placeholder copy.
 */

/** Error markers that mean "could not reach the database", not "bad query". */
const OUTAGE_CODES = new Set([
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_HEADERS_TIMEOUT",
  "UND_ERR_SOCKET",
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "ENOTFOUND",
]);

const OUTAGE_PATTERNS = [
  /fetch failed/i,
  /connect timeout/i,
  /socket hang up/i,
  /network/i,
  /SERVER_ERROR: Server returned HTTP status 5\d\d/i,
];

function isOutage(error: unknown, depth = 0): boolean {
  if (!error || depth > 6) return false;

  if (typeof error === "object") {
    const candidate = error as { code?: unknown; message?: unknown; cause?: unknown };

    if (typeof candidate.code === "string" && OUTAGE_CODES.has(candidate.code)) {
      return true;
    }
    if (
      typeof candidate.message === "string" &&
      OUTAGE_PATTERNS.some((pattern) => pattern.test(candidate.message as string))
    ) {
      return true;
    }
    if (candidate.cause) {
      return isOutage(candidate.cause, depth + 1);
    }
  }

  return false;
}

export function staticFallbackOrThrow<T>(error: unknown, fallback: T): T {
  if (!process.env.TURSO_DATABASE_URL) {
    return fallback;
  }

  if (isOutage(error)) {
    console.warn(
      "[db] database unreachable, serving static fallback:",
      error instanceof Error ? error.message : error,
    );
    return fallback;
  }

  throw error;
}
