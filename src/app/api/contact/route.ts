import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/db/client";
import { contactSubmissions } from "@/db/schema";
import { ensureContactSubmissionsTable } from "@/db/queries/contact-submissions";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > 20_000) {
    return NextResponse.json({ error: "Request is too large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (text(body.website, 200)) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const kind = body.kind === "membership" ? "membership" : "contact";
  const name = text(body.name, 120);
  const email = text(body.email, 254).toLowerCase();
  const phone = text(body.phone ?? body.whatsapp, 40);
  const subject = text(body.subject, 160);
  const message = text(body.message ?? body.motivation, 5_000);

  if (!name || !emailPattern.test(email) || !message || (kind === "contact" && !subject)) {
    return NextResponse.json({ error: "Required fields are missing or invalid" }, { status: 400 });
  }

  const metadata = kind === "membership"
    ? JSON.stringify({
        institution: text(body.institution, 180),
        city: text(body.city, 120),
      })
    : JSON.stringify({
        membership: text(body.membership, 80),
        department: text(body.department, 80),
      });

  try {
    await ensureContactSubmissionsTable();
    await db.insert(contactSubmissions).values({
      id: nanoid(),
      kind,
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      metadata,
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Submission could not be saved" }, { status: 503 });
  }
}
