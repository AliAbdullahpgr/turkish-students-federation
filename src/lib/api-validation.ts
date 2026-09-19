import { NextRequest, NextResponse } from "next/server";

export class ApiInputError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export async function readJsonObject(req: NextRequest, maxBytes = 100_000) {
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > maxBytes) throw new ApiInputError("Request is too large", 413);

  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new ApiInputError("JSON object required");
    }
    return body as Record<string, unknown>;
  } catch (error) {
    if (error instanceof ApiInputError) throw error;
    throw new ApiInputError("Invalid JSON body");
  }
}

export function requiredText(body: Record<string, unknown>, key: string, maxLength = 500) {
  const value = body[key];
  if (typeof value !== "string" || !value.trim()) throw new ApiInputError(`${key} is required`);
  return value.trim().slice(0, maxLength);
}

export function optionalText(body: Record<string, unknown>, key: string, maxLength = 5_000) {
  const value = body[key];
  return typeof value === "string" && value.trim() ? value.trim().slice(0, maxLength) : null;
}

export function integer(body: Record<string, unknown>, key: string, fallback = 0, min = 0, max = 100_000) {
  const value = body[key];
  if (value === undefined || value === null || value === "") return fallback;
  if (!Number.isInteger(value) || (value as number) < min || (value as number) > max) {
    throw new ApiInputError(`${key} must be an integer between ${min} and ${max}`);
  }
  return value as number;
}

export function boolean(body: Record<string, unknown>, key: string, fallback: boolean) {
  const value = body[key];
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "boolean") throw new ApiInputError(`${key} must be a boolean`);
  return value;
}

/**
 * Whether an error is a unique-constraint violation.
 *
 * The cause chain has to be walked: drizzle rethrows driver errors wrapped, so
 * the top-level message is only ever `Failed query: insert into ...` and the
 * `UNIQUE constraint failed` text sits on `error.cause`. Matching just the
 * outer message — which is what this used to do — turned every duplicate slug
 * into a 503 "Request could not be completed", so the admin panel reported a
 * server outage when the real problem was a name already in use.
 */
function isUniqueViolation(error: unknown, depth = 0): boolean {
  if (!error || depth > 6 || typeof error !== "object") return false;

  const candidate = error as { code?: unknown; message?: unknown; cause?: unknown };

  if (typeof candidate.code === "string" && candidate.code.startsWith("SQLITE_CONSTRAINT")) {
    return true;
  }
  if (typeof candidate.message === "string" && /unique constraint/i.test(candidate.message)) {
    return true;
  }

  return isUniqueViolation(candidate.cause, depth + 1);
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiInputError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (isUniqueViolation(error)) {
    return NextResponse.json({ error: "A record with that unique value already exists" }, { status: 409 });
  }
  return NextResponse.json({ error: "Request could not be completed" }, { status: 503 });
}
