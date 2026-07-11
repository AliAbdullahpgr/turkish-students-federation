import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { getContactSubmissions } from "@/db/queries/contact-submissions";

export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  try {
    return NextResponse.json(await getContactSubmissions());
  } catch {
    return NextResponse.json({ error: "Submissions could not be loaded" }, { status: 503 });
  }
}
