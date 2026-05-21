import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Contact submissions are stored via the public /api/contact route
// For now, this just returns an empty array placeholder
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json([]);
}
