import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Placeholder — in production send email or store in DB
  console.log("Contact form submission:", body);
  return NextResponse.json({ success: true });
}
