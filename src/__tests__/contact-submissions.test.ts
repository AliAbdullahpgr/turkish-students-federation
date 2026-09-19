import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { setupSchema, resetTables, closeHarness, jsonRequest, countRows } from "./helpers/admin-harness";

/*
  The contact and membership forms are the one flow that runs the other way:
  the public site writes and the admin panel reads. These check that a
  submission made on the public site reaches the admin inbox intact.
*/

type Handler = (req: Request) => Promise<Response>;

let publicRoute: { POST: Handler };
let adminRoute: { GET: Handler };

beforeAll(async () => {
  await setupSchema();
  publicRoute = (await import("@/app/api/contact/route")) as unknown as typeof publicRoute;
  adminRoute = (await import("@/app/api/admin/contact-submissions/route")) as unknown as typeof adminRoute;
});

afterAll(closeHarness);
beforeEach(resetTables);

function submit(body: Record<string, unknown>) {
  return publicRoute.POST(jsonRequest("POST", body, "http://localhost/api/contact"));
}

async function inbox() {
  const res = await adminRoute.GET(jsonRequest("GET"));
  expect(res.status).toBe(200);
  return res.json();
}

describe("public contact form -> admin inbox", () => {
  it("a contact submission reaches the admin inbox with every field", async () => {
    const res = await submit({
      kind: "contact",
      name: "Mehmet Demir",
      email: "Mehmet@Example.COM",
      phone: "+90 555 000 0000",
      subject: "Burs hakkında",
      message: "Burs başvurusu hakkında bilgi almak istiyorum.",
      membership: "üye",
      department: "Eğitim",
    });
    expect(res.status).toBe(201);

    const submissions = await inbox();
    expect(submissions).toHaveLength(1);
    expect(submissions[0].kind).toBe("contact");
    expect(submissions[0].name).toBe("Mehmet Demir");
    expect(submissions[0].subject).toBe("Burs hakkında");
    expect(submissions[0].message).toContain("Burs başvurusu");
    expect(submissions[0].phone).toBe("+90 555 000 0000");
    expect(JSON.parse(submissions[0].metadata)).toEqual({ membership: "üye", department: "Eğitim" });
  });

  it("lower-cases the email so the inbox does not hold two spellings of one address", async () => {
    await submit({
      name: "Ad",
      email: "KARISIK@Example.COM",
      subject: "Konu",
      message: "Mesaj",
    });
    expect((await inbox())[0].email).toBe("karisik@example.com");
  });

  it("a membership application stores its own metadata and needs no subject", async () => {
    const res = await submit({
      kind: "membership",
      name: "Zeynep Kaya",
      email: "zeynep@example.com",
      whatsapp: "+92 300 0000000",
      motivation: "Birliğe katılmak istiyorum.",
      institution: "Punjab Üniversitesi",
      city: "Lahor",
    });
    expect(res.status).toBe(201);

    const submissions = await inbox();
    expect(submissions[0].kind).toBe("membership");
    expect(submissions[0].message).toBe("Birliğe katılmak istiyorum.");
    expect(submissions[0].phone).toBe("+92 300 0000000");
    expect(JSON.parse(submissions[0].metadata)).toEqual({
      institution: "Punjab Üniversitesi",
      city: "Lahor",
    });
  });

  it("shows the newest submission first", async () => {
    await submit({ name: "Bir", email: "b@example.com", subject: "K", message: "M" });
    // `created_at` has one-second resolution, so the order is forced explicitly
    // rather than relying on two inserts landing in different seconds.
    const { testClient } = await import("./helpers/admin-harness");
    await testClient.execute("UPDATE contact_submissions SET created_at = '2020-01-01 00:00:00'");
    await submit({ name: "İki", email: "i@example.com", subject: "K", message: "M" });

    expect((await inbox()).map((s: { name: string }) => s.name)).toEqual(["İki", "Bir"]);
  });

  it("silently accepts and discards a honeypot submission", async () => {
    const res = await submit({
      name: "Bot",
      email: "bot@example.com",
      subject: "Spam",
      message: "Spam",
      website: "http://spam.example.org",
    });

    // A bot must not learn it was caught, so this still reads as success.
    expect(res.status).toBe(201);
    expect(await countRows("contact_submissions")).toBe(0);
  });

  it("rejects a missing name, a bad email, an empty message or a missing subject", async () => {
    const base = { name: "Ad", email: "ad@example.com", subject: "Konu", message: "Mesaj" };

    expect((await submit({ ...base, name: "" })).status).toBe(400);
    expect((await submit({ ...base, email: "not-an-email" })).status).toBe(400);
    expect((await submit({ ...base, message: "" })).status).toBe(400);
    expect((await submit({ ...base, subject: "" })).status).toBe(400);

    expect(await countRows("contact_submissions")).toBe(0);
  });

  it("rejects a malformed JSON body", async () => {
    const { NextRequest } = await import("next/server");
    const res = await publicRoute.POST(
      new NextRequest("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ not json",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("truncates an over-long message rather than rejecting the enquiry", async () => {
    await submit({
      name: "Ad",
      email: "ad@example.com",
      subject: "Konu",
      message: "M".repeat(9_000),
    });
    expect((await inbox())[0].message).toHaveLength(5_000);
  });

  it("stores a contact enquiry with no phone as null", async () => {
    await submit({ name: "Ad", email: "ad@example.com", subject: "Konu", message: "Mesaj" });
    expect((await inbox())[0].phone).toBeNull();
  });

  it("only ever records the two known kinds", async () => {
    await submit({
      kind: "something-else",
      name: "Ad",
      email: "ad@example.com",
      subject: "Konu",
      message: "Mesaj",
    });
    expect((await inbox())[0].kind).toBe("contact");
  });
});
