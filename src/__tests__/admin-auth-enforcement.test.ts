import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { setupSchema, closeHarness, jsonRequest, routeParams, countRows } from "./helpers/admin-harness";

/*
  Every `/api/admin/*` handler must refuse a request that carries no admin
  session. The gate lives in each handler rather than in middleware (the session
  lookup needs the database, which edge middleware cannot reach), so "every
  handler remembered to call it" is a property worth checking directly — a new
  route that forgets the two-line guard is otherwise wide open.

  The bypass the other suites rely on is switched off here, and `next/headers`
  is stubbed to an empty header set, which is what an unauthenticated request
  looks like to better-auth.
*/

process.env.ADMIN_AUTH_BYPASS = "0";

vi.mock("next/headers", () => ({
  headers: async () => new Headers(),
  cookies: async () => ({ get: () => undefined, getAll: () => [] }),
}));

type AnyHandler = (req: Request, ctx?: unknown) => Promise<Response>;

/** Every admin endpoint, with a representative call for each method. */
const endpoints: { name: string; load: () => Promise<Record<string, unknown>>; methods: string[]; withParams?: boolean }[] = [
  { name: "media", load: () => import("@/app/api/admin/media/route"), methods: ["GET", "POST"] },
  { name: "media/[id]", load: () => import("@/app/api/admin/media/[id]/route"), methods: ["DELETE"], withParams: true },
  { name: "blog-posts", load: () => import("@/app/api/admin/blog-posts/route"), methods: ["GET", "POST"] },
  { name: "blog-posts/[id]", load: () => import("@/app/api/admin/blog-posts/[id]/route"), methods: ["GET", "PUT", "DELETE"], withParams: true },
  { name: "activity-posts", load: () => import("@/app/api/admin/activity-posts/route"), methods: ["GET", "POST"] },
  { name: "activity-posts/[id]", load: () => import("@/app/api/admin/activity-posts/[id]/route"), methods: ["GET", "PUT", "DELETE"], withParams: true },
  { name: "events", load: () => import("@/app/api/admin/events/route"), methods: ["GET", "POST"] },
  { name: "events/[id]", load: () => import("@/app/api/admin/events/[id]/route"), methods: ["GET", "PUT", "DELETE"], withParams: true },
  { name: "team-members", load: () => import("@/app/api/admin/team-members/route"), methods: ["GET", "POST"] },
  { name: "team-members/[id]", load: () => import("@/app/api/admin/team-members/[id]/route"), methods: ["GET", "PUT", "DELETE"], withParams: true },
  { name: "courses", load: () => import("@/app/api/admin/courses/route"), methods: ["GET", "POST"] },
  { name: "courses/[id]", load: () => import("@/app/api/admin/courses/[id]/route"), methods: ["GET", "PUT", "DELETE"], withParams: true },
  { name: "activities", load: () => import("@/app/api/admin/activities/route"), methods: ["GET", "POST"] },
  { name: "activities/[id]", load: () => import("@/app/api/admin/activities/[id]/route"), methods: ["GET", "PUT", "DELETE"], withParams: true },
  { name: "guide-sections", load: () => import("@/app/api/admin/guide-sections/route"), methods: ["GET", "POST"] },
  { name: "guide-sections/[id]", load: () => import("@/app/api/admin/guide-sections/[id]/route"), methods: ["GET", "PUT", "DELETE"], withParams: true },
  { name: "guide-sections/reorder", load: () => import("@/app/api/admin/guide-sections/reorder/route"), methods: ["PUT"] },
  { name: "navigation", load: () => import("@/app/api/admin/navigation/route"), methods: ["GET", "POST"] },
  { name: "navigation/[id]", load: () => import("@/app/api/admin/navigation/[id]/route"), methods: ["GET", "PUT", "DELETE"], withParams: true },
  { name: "navigation/reorder", load: () => import("@/app/api/admin/navigation/reorder/route"), methods: ["PUT"] },
  { name: "site-settings", load: () => import("@/app/api/admin/site-settings/route"), methods: ["GET", "PUT"] },
  { name: "contact-submissions", load: () => import("@/app/api/admin/contact-submissions/route"), methods: ["GET"] },
];

beforeAll(setupSchema);
afterAll(closeHarness);

describe("admin API refuses unauthenticated requests", () => {
  for (const endpoint of endpoints) {
    for (const method of endpoint.methods) {
      it(`${method} /api/admin/${endpoint.name} answers 401`, async () => {
        const mod = await endpoint.load();
        const handler = mod[method] as AnyHandler;
        expect(handler, `${endpoint.name} exports no ${method}`).toBeTypeOf("function");

        const req = jsonRequest(method, method === "GET" || method === "DELETE" ? undefined : {});
        const res = endpoint.withParams ? await handler(req, routeParams("any-id")) : await handler(req);

        expect(res.status).toBe(401);
        expect((await res.json()).error).toBe("Unauthorized");
      });
    }
  }

  it("a refused write leaves the database untouched", async () => {
    const mod = await import("@/app/api/admin/blog-posts/route");
    await (mod.POST as unknown as AnyHandler)(
      jsonRequest("POST", { title: "İzinsiz Yazı", excerpt: "olmamalı" }),
    );
    expect(await countRows("blog_posts")).toBe(0);
  });

  it("the public contact endpoint stays open, since it is how the site writes in", async () => {
    const mod = await import("@/app/api/contact/route");
    const res = await (mod.POST as unknown as AnyHandler)(
      jsonRequest(
        "POST",
        { name: "Ad", email: "ad@example.com", subject: "Konu", message: "Mesaj" },
        "http://localhost/api/contact",
      ),
    );
    expect(res.status).toBe(201);
  });
});
