import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function requireAdminRequest() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.publicMetadata?.isAdmin !== true) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
