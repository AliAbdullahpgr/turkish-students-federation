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

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiInputError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return NextResponse.json({ error: "Request could not be completed" }, { status: 503 });
}
