import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth-guard";

/**
 * Gate for `/api/admin/*` route handlers.
 *
 * Returns a response to send when the caller is not an administrator, and null
 * when the request may proceed — so every handler starts with:
 *
 *     const unauthorized = await requireAdminRequest();
 *     if (unauthorized) return unauthorized;
 *
 * Route protection is enforced here and in the admin layout rather than in
 * middleware: the session lookup needs the database, which the edge runtime
 * middleware cannot reach.
 */
export async function requireAdminRequest() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
