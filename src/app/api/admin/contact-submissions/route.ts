import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";

// Contact submissions are stored via the public /api/contact route
// For now, this just returns an empty array placeholder
export async function GET() {
  const unauthorizedResponse = await requireAdminRequest();
  if (unauthorizedResponse) return unauthorizedResponse;
  return NextResponse.json([]);
}
