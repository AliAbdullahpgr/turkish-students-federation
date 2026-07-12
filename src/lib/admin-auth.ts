import { currentUser, type User } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ADMIN_EMAILS = new Set(["admin@tfs.pk"]);
const ADMIN_USERNAMES = new Set(["tsf789admin"]);

export function isAdminUser(user: User | null) {
  if (!user) return false;

  if (user.publicMetadata?.isAdmin === true) {
    return true;
  }

  const primaryEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (primaryEmail && ADMIN_EMAILS.has(primaryEmail)) {
    return true;
  }

  const username = user.username?.toLowerCase();
  if (username && ADMIN_USERNAMES.has(username)) {
    return true;
  }

  return false;
}

export async function requireAdminRequest() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminUser(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
