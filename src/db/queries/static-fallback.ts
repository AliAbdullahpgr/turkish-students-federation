/**
 * Static content is useful for first-time local setup, but must not hide an
 * outage or schema problem when a database has been configured.
 */
export function staticFallbackOrThrow<T>(error: unknown, fallback: T): T {
  if (process.env.TURSO_DATABASE_URL) {
    throw error;
  }

  return fallback;
}
