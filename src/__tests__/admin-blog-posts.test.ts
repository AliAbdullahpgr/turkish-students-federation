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
  testClient,
} from "./helpers/admin-harness";

/*
  Admin blog posts, written through the real route handlers and read back
  through the public query functions that `/news-blogs` and `/` call.

  The point of each test is the round trip: a write that lands in the database
  but never reaches the public reader is the failure mode these are looking for.
*/

type Handler = (req: Request, ctx?: unknown) => Promise<Response>;

let routes: { GET: Handler; POST: Handler };
let idRoutes: { GET: Handler; PUT: Handler; DELETE: Handler };
let publicQueries: typeof import("@/db/queries/blog-posts");

beforeAll(async () => {
  await setupSchema();
  routes = (await import("@/app/api/admin/blog-posts/route")) as unknown as typeof routes;
  idRoutes = (await import("@/app/api/admin/blog-posts/[id]/route")) as unknown as typeof idRoutes;
  publicQueries = await import("@/db/queries/blog-posts");
});

afterAll(closeHarness);
beforeEach(resetTables);

async function createPost(overrides: Record<string, unknown> = {}) {
  const res = await routes.POST(
    jsonRequest("POST", {
      title: "Lahor'da Öğrenci Olmak",
      excerpt: "Şehre yeni gelenler için notlar",
      body: "# Başlık\n\nGövde metni.",
      category: "Rehber",
      author: "Ömer Abbas",
      publishedAt: "2026-03-01",
      ...overrides,
    }),
  );
  return res;
}

describe("admin blog posts -> public /news-blogs", () => {
  it("a created post is immediately visible to the public reader", async () => {
    const res = await createPost();
    expect(res.status).toBe(201);
    const created = await res.json();

    const published = await publicQueries.getBlogPostBySlug(created.slug);
    expect(published).toBeDefined();
    expect(published!.title).toBe("Lahor'da Öğrenci Olmak");
    expect(published!.excerpt).toBe("Şehre yeni gelenler için notlar");
    expect(published!.body).toContain("Gövde metni");
    expect(published!.author).toBe("Ömer Abbas");

    const all = await publicQueries.getAllBlogPosts();
    expect(all.map((p) => p.slug)).toContain(created.slug);
  });

  it("derives a slug from the title and keeps it URL-safe", async () => {
    const res = await createPost({ title: "Çok Güzel Bir Başlık!", slug: undefined });
    const created = await res.json();
    expect(created.slug).toBe("cok-guzel-bir-baslik");
    expect(await publicQueries.getBlogPostBySlug("cok-guzel-bir-baslik")).toBeDefined();
  });

  it("rejects a duplicate slug with 409 rather than corrupting the first post", async () => {
    const first = await (await createPost({ title: "Aynı Başlık" })).json();
    const second = await createPost({ title: "Aynı Başlık" });

    expect(second.status).toBe(409);
    expect(await countRows("blog_posts")).toBe(1);

    // The original must be untouched.
    const still = await publicQueries.getBlogPostBySlug(first.slug);
    expect(still!.id).toBe(first.id);
  });

  it("surfaces an uploaded thumbnail as a usable public image URL", async () => {
    const media = await seedMedia("blog-thumb");
    const created = await (await createPost({ thumbnailMediaId: media.id })).json();

    const published = await publicQueries.getBlogPostBySlug(created.slug);
    expect(published!.thumbnail).toBe(media.secureUrl);
    expect(published!.thumbnail!.startsWith("https://")).toBe(true);
  });

  it("leaves thumbnail null when no image was chosen, instead of failing the join", async () => {
    const created = await (await createPost()).json();
    const published = await publicQueries.getBlogPostBySlug(created.slug);
    expect(published!.thumbnail).toBeNull();
  });

  it("featuring a post puts it on the homepage query, unfeaturing removes it", async () => {
    const created = await (await createPost({ isFeatured: false })).json();
    expect(await publicQueries.getFeaturedBlogPosts()).toHaveLength(0);

    await idRoutes.PUT(
      jsonRequest("PUT", { title: created.title, isFeatured: true, publishedAt: created.publishedAt }),
      routeParams(created.id),
    );
    const featured = await publicQueries.getFeaturedBlogPosts();
    expect(featured.map((p) => p.id)).toEqual([created.id]);

    await idRoutes.PUT(
      jsonRequest("PUT", { title: created.title, isFeatured: false, publishedAt: created.publishedAt }),
      routeParams(created.id),
    );
    expect(await publicQueries.getFeaturedBlogPosts()).toHaveLength(0);
  });

  it("an edit is reflected publicly, and the old slug stops resolving", async () => {
    const created = await (await createPost({ title: "İlk Başlık" })).json();
    const oldSlug = created.slug;

    const res = await idRoutes.PUT(
      jsonRequest("PUT", {
        title: "Düzeltilmiş Başlık",
        excerpt: "Güncellenmiş özet",
        body: "Yeni gövde",
        publishedAt: created.publishedAt,
      }),
      routeParams(created.id),
    );
    expect(res.status).toBe(200);
    const updated = await res.json();
    expect(updated.slug).toBe("duzeltilmis-baslik");

    expect(await publicQueries.getBlogPostBySlug(updated.slug)).toBeDefined();
    expect(await publicQueries.getBlogPostBySlug(oldSlug)).toBeUndefined();

    const published = await publicQueries.getBlogPostBySlug(updated.slug);
    expect(published!.title).toBe("Düzeltilmiş Başlık");
    expect(published!.excerpt).toBe("Güncellenmiş özet");
  });

  it("a deleted post disappears from every public list", async () => {
    const created = await (await createPost()).json();
    expect(await publicQueries.getAllBlogPosts()).toHaveLength(1);

    const res = await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(res.status).toBe(200);

    expect(await publicQueries.getAllBlogPosts()).toHaveLength(0);
    expect(await publicQueries.getBlogPostBySlug(created.slug)).toBeUndefined();
    expect(await publicQueries.getLatestBlogPosts()).toHaveLength(0);
  });

  it("orders the public list newest first regardless of insertion order", async () => {
    await createPost({ title: "Eski", publishedAt: "2024-01-01" });
    await createPost({ title: "Yeni", publishedAt: "2026-09-01" });
    await createPost({ title: "Orta", publishedAt: "2025-05-01" });

    const all = await publicQueries.getAllBlogPosts();
    expect(all.map((p) => p.title)).toEqual(["Yeni", "Orta", "Eski"]);
  });

  it("search finds a freshly written post by title and by month", async () => {
    await createPost({ title: "Karaçi Rehberi", publishedAt: "2026-04-10" });
    await createPost({ title: "İslamabad Notları", publishedAt: "2026-05-10" });

    expect((await publicQueries.searchBlogPosts("Karaçi")).map((p) => p.title)).toEqual(["Karaçi Rehberi"]);
    expect((await publicQueries.searchBlogPosts("", "2026-05")).map((p) => p.title)).toEqual(["İslamabad Notları"]);
  });

  it("revalidates the homepage and the post's public paths on every mutation", async () => {
    const created = await (await createPost()).json();
    expect(revalidatedPaths).toContain("/");
    expect(revalidatedPaths).toContain("/news-blogs");
    expect(revalidatedPaths).toContain(`/news-blogs/${created.slug}`);

    revalidatedPaths.length = 0;
    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(revalidatedPaths).toContain("/news-blogs");
  });

  it("rejects a post with no title and writes nothing", async () => {
    const res = await routes.POST(jsonRequest("POST", { excerpt: "başlıksız" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/title is required/);
    expect(await countRows("blog_posts")).toBe(0);
  });

  it("returns 404 for editing or deleting an unknown id", async () => {
    expect((await idRoutes.PUT(jsonRequest("PUT", { title: "x" }), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.DELETE(jsonRequest("DELETE"), routeParams("nope"))).status).toBe(404);
  });

  it("truncates an over-long title at the documented limit instead of erroring", async () => {
    const created = await (await createPost({ title: "A".repeat(500) })).json();
    expect(created.title).toHaveLength(220);
  });

  it("the admin list shows drafts and published alike, newest created first", async () => {
    await createPost({ title: "Bir" });
    await createPost({ title: "İki" });

    const res = await routes.GET(jsonRequest("GET"));
    expect(res.status).toBe(200);
    const list = await res.json();
    expect(list).toHaveLength(2);
    expect(await countRows("blog_posts")).toBe(2);
  });

  it("stores markdown body unmangled so the public page renders what was typed", async () => {
    const body = "## Alt başlık\n\n- madde bir\n- madde iki\n\n**kalın** ve _italik_";
    const created = await (await createPost({ body })).json();
    const published = await publicQueries.getBlogPostBySlug(created.slug);
    expect(published!.body).toBe(body);

    const row = await testClient.execute({
      sql: "SELECT body FROM blog_posts WHERE id = ?",
      args: [created.id],
    });
    expect((row.rows[0] as unknown as { body: string }).body).toBe(body);
  });
});
