import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
  setupSchema,
  resetTables,
  closeHarness,
  jsonRequest,
  routeParams,
  seedMedia,
  countRows,
  revalidatedPaths,
} from "./helpers/admin-harness";

type Handler = (req: Request, ctx?: unknown) => Promise<Response>;

let routes: { GET: Handler; POST: Handler };
let idRoutes: { GET: Handler; PUT: Handler; DELETE: Handler };
let publicQueries: typeof import("@/db/queries/activity-posts");

beforeAll(async () => {
  await setupSchema();
  routes = (await import("@/app/api/admin/activity-posts/route")) as unknown as typeof routes;
  idRoutes = (await import("@/app/api/admin/activity-posts/[id]/route")) as unknown as typeof idRoutes;
  publicQueries = await import("@/db/queries/activity-posts");
});

afterAll(closeHarness);
beforeEach(resetTables);

function createActivityPost(overrides: Record<string, unknown> = {}) {
  return routes.POST(
    jsonRequest("POST", {
      title: "Yetimhane Ziyareti",
      excerpt: "Lahor'daki yetimhaneyi ziyaret ettik.",
      body: "Gün boyunca çocuklarla vakit geçirdik.",
      category: "Sosyal Sorumluluk",
      location: "Lahor",
      happenedAt: "2026-06-15",
      isPublished: true,
      ...overrides,
    }),
  );
}

describe("admin activity posts -> public /faaliyetler", () => {
  it("a published post appears on the public list and detail reader", async () => {
    const res = await createActivityPost();
    expect(res.status).toBe(201);
    const created = await res.json();

    const published = await publicQueries.getPublishedActivityPosts();
    expect(published.map((p) => p.id)).toEqual([created.id]);
    expect(published[0].title).toBe("Yetimhane Ziyareti");
    expect(published[0].location).toBe("Lahor");

    const detail = await publicQueries.getActivityPostBySlug(created.slug);
    expect(detail).toBeDefined();
    expect(detail!.body).toContain("çocuklarla vakit geçirdik");
  });

  it("an unpublished post is hidden from both the public list and the detail page", async () => {
    const created = await (await createActivityPost({ isPublished: false })).json();

    expect(await publicQueries.getPublishedActivityPosts()).toHaveLength(0);
    expect(await publicQueries.getActivityPostBySlug(created.slug)).toBeUndefined();

    // ...but the admin still sees it.
    expect(await publicQueries.getAllActivityPosts()).toHaveLength(1);
  });

  it("publishing an existing draft makes it public, unpublishing hides it again", async () => {
    const created = await (await createActivityPost({ isPublished: false })).json();

    await idRoutes.PUT(
      jsonRequest("PUT", { title: created.title, isPublished: true, happenedAt: created.happenedAt }),
      routeParams(created.id),
    );
    expect(await publicQueries.getPublishedActivityPosts()).toHaveLength(1);
    expect(await publicQueries.getActivityPostBySlug(created.slug)).toBeDefined();

    await idRoutes.PUT(
      jsonRequest("PUT", { title: created.title, isPublished: false, happenedAt: created.happenedAt }),
      routeParams(created.id),
    );
    expect(await publicQueries.getPublishedActivityPosts()).toHaveLength(0);
    expect(await publicQueries.getActivityPostBySlug(created.slug)).toBeUndefined();
  });

  it("defaults the category to 'Faaliyet' when none is given", async () => {
    const created = await (await createActivityPost({ category: undefined })).json();
    expect(created.category).toBe("Faaliyet");
  });

  it("surfaces the thumbnail as a public HTTPS URL", async () => {
    const media = await seedMedia("activity-thumb");
    await createActivityPost({ thumbnailMediaId: media.id });

    const published = await publicQueries.getPublishedActivityPosts();
    expect(published[0].thumbnail).toBe(media.secureUrl);
  });

  it("orders the public list by date, most recent first", async () => {
    await createActivityPost({ title: "Eski Faaliyet", happenedAt: "2024-02-02" });
    await createActivityPost({ title: "Yeni Faaliyet", happenedAt: "2026-08-08" });
    await createActivityPost({ title: "Orta Faaliyet", happenedAt: "2025-05-05" });

    const published = await publicQueries.getPublishedActivityPosts();
    expect(published.map((p) => p.title)).toEqual(["Yeni Faaliyet", "Orta Faaliyet", "Eski Faaliyet"]);
  });

  it("honours the limit the homepage passes", async () => {
    await createActivityPost({ title: "Bir", happenedAt: "2026-01-01" });
    await createActivityPost({ title: "İki", happenedAt: "2026-02-01" });
    await createActivityPost({ title: "Üç", happenedAt: "2026-03-01" });

    expect(await publicQueries.getPublishedActivityPosts(2)).toHaveLength(2);
  });

  it("rejects a duplicate slug with 409 and leaves the original intact", async () => {
    const first = await (await createActivityPost({ title: "Aynı Faaliyet" })).json();
    const second = await createActivityPost({ title: "Aynı Faaliyet" });

    expect(second.status).toBe(409);
    expect(await countRows("activity_posts")).toBe(1);
    expect((await publicQueries.getActivityPostBySlug(first.slug))!.id).toBe(first.id);
  });

  it("changing the title changes the public URL and retires the old one", async () => {
    const created = await (await createActivityPost({ title: "İlk Ad" })).json();
    const oldSlug = created.slug;

    const res = await idRoutes.PUT(
      jsonRequest("PUT", { title: "İkinci Ad", isPublished: true, happenedAt: created.happenedAt }),
      routeParams(created.id),
    );
    const updated = await res.json();

    expect(await publicQueries.getActivityPostBySlug(updated.slug)).toBeDefined();
    expect(await publicQueries.getActivityPostBySlug(oldSlug)).toBeUndefined();
  });

  it("a deleted post disappears from the public list and detail page", async () => {
    const created = await (await createActivityPost()).json();
    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));

    expect(await publicQueries.getPublishedActivityPosts()).toHaveLength(0);
    expect(await publicQueries.getActivityPostBySlug(created.slug)).toBeUndefined();
  });

  it("revalidates the homepage, the list and the post path on every mutation", async () => {
    const created = await (await createActivityPost()).json();
    expect(revalidatedPaths).toContain("/");
    expect(revalidatedPaths).toContain("/faaliyetler");
    expect(revalidatedPaths).toContain(`/faaliyetler/${created.slug}`);

    revalidatedPaths.length = 0;
    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(revalidatedPaths).toContain(`/faaliyetler/${created.slug}`);
  });

  it("requires a title and writes nothing without one", async () => {
    const res = await routes.POST(jsonRequest("POST", { excerpt: "yok" }));
    expect(res.status).toBe(400);
    expect(await countRows("activity_posts")).toBe(0);
  });

  it("returns 404 for an unknown id", async () => {
    expect((await idRoutes.GET(jsonRequest("GET"), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.PUT(jsonRequest("PUT", { title: "x" }), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.DELETE(jsonRequest("DELETE"), routeParams("nope"))).status).toBe(404);
  });
});
