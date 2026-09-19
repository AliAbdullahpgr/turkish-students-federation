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
  Media is the one table every other content type points at, so deleting a row
  here is the change most likely to alter a public page without anyone editing
  that page. These tests pin down what actually happens.
*/

type Handler = (req: Request, ctx?: unknown) => Promise<Response>;

let mediaRoutes: { GET: Handler; POST: Handler };
let mediaIdRoutes: { DELETE: Handler };
let blogRoutes: { POST: Handler };
let blogQueries: typeof import("@/db/queries/blog-posts");
let eventRoutes: { POST: Handler };
let eventQueries: typeof import("@/db/queries/events");

beforeAll(async () => {
  await setupSchema();
  mediaRoutes = (await import("@/app/api/admin/media/route")) as unknown as typeof mediaRoutes;
  mediaIdRoutes = (await import("@/app/api/admin/media/[id]/route")) as unknown as typeof mediaIdRoutes;
  blogRoutes = (await import("@/app/api/admin/blog-posts/route")) as unknown as typeof blogRoutes;
  blogQueries = await import("@/db/queries/blog-posts");
  eventRoutes = (await import("@/app/api/admin/events/route")) as unknown as typeof eventRoutes;
  eventQueries = await import("@/db/queries/events");
});

afterAll(closeHarness);
beforeEach(resetTables);

describe("media lifecycle and its effect on public pages", () => {
  it("an uploaded image is immediately usable as a blog thumbnail", async () => {
    const upload = await mediaRoutes.POST(
      jsonRequest("POST", {
        cloudinaryPublicId: "ptob/kapak",
        url: "http://res.cloudinary.com/ptob/image/upload/v1/kapak.jpg",
        secureUrl: "https://res.cloudinary.com/ptob/image/upload/v1/kapak.jpg",
        width: 1600,
        height: 900,
        format: "jpg",
        resourceType: "image",
      }),
    );
    expect(upload.status).toBe(201);
    const media = await upload.json();

    const post = await (
      await blogRoutes.POST(
        jsonRequest("POST", { title: "Kapaklı Yazı", excerpt: "x", thumbnailMediaId: media.id }),
      )
    ).json();

    const published = await blogQueries.getBlogPostBySlug(post.slug);
    expect(published!.thumbnail).toBe("https://res.cloudinary.com/ptob/image/upload/v1/kapak.jpg");
  });

  it("one image can back several pieces of content at once", async () => {
    const media = await seedMedia("paylasilan");

    const post = await (
      await blogRoutes.POST(
        jsonRequest("POST", { title: "Yazı", excerpt: "x", thumbnailMediaId: media.id }),
      )
    ).json();
    await eventRoutes.POST(
      jsonRequest("POST", { title: "Etkinlik", status: "upcoming", posterMediaId: media.id }),
    );

    expect((await blogQueries.getBlogPostBySlug(post.slug))!.thumbnail).toBe(media.secureUrl);
    expect((await eventQueries.getAllEvents())[0].posterImage).toBe(media.secureUrl);
  });

  it("refuses to delete an image a blog post still uses, and says which kind", async () => {
    const media = await seedMedia("silinecek");
    const post = await (
      await blogRoutes.POST(
        jsonRequest("POST", { title: "Resimli Yazı", excerpt: "x", thumbnailMediaId: media.id }),
      )
    ).json();
    expect((await blogQueries.getBlogPostBySlug(post.slug))!.thumbnail).toBe(media.secureUrl);

    const res = await mediaIdRoutes.DELETE(jsonRequest("DELETE"), routeParams(media.id));
    expect(res.status).toBe(409);
    expect((await res.json()).inUse).toEqual(["blog yazısı"]);

    // The picture is still on the public page, which is the point.
    expect((await blogQueries.getBlogPostBySlug(post.slug))!.thumbnail).toBe(media.secureUrl);
    expect(await countRows("media")).toBe(1);
  });

  it("names every kind of content holding the image, not just the first", async () => {
    const media = await seedMedia("cok-kullanilan");
    await blogRoutes.POST(
      jsonRequest("POST", { title: "Yazı", excerpt: "x", thumbnailMediaId: media.id }),
    );
    await eventRoutes.POST(
      jsonRequest("POST", { title: "Etkinlik", status: "upcoming", posterMediaId: media.id }),
    );

    const res = await mediaIdRoutes.DELETE(jsonRequest("DELETE"), routeParams(media.id));
    expect(res.status).toBe(409);
    expect((await res.json()).inUse).toEqual(["blog yazısı", "etkinlik"]);
  });

  it("allows the delete once the last reference is cleared", async () => {
    const media = await seedMedia("serbest-kalan");
    const post = await (
      await blogRoutes.POST(
        jsonRequest("POST", { title: "Yazı", excerpt: "x", thumbnailMediaId: media.id }),
      )
    ).json();
    expect((await mediaIdRoutes.DELETE(jsonRequest("DELETE"), routeParams(media.id))).status).toBe(409);

    await testClient.execute({
      sql: "UPDATE blog_posts SET thumbnail_media_id = NULL WHERE id = ?",
      args: [post.id],
    });

    expect((await mediaIdRoutes.DELETE(jsonRequest("DELETE"), routeParams(media.id))).status).toBe(200);
    expect(await countRows("media")).toBe(0);
  });

  it("deleting an unused image needs no revalidation, because no page can show it", async () => {
    const media = await seedMedia("kullanilmayan");

    revalidatedPaths.length = 0;
    expect((await mediaIdRoutes.DELETE(jsonRequest("DELETE"), routeParams(media.id))).status).toBe(200);
    expect(revalidatedPaths).toEqual([]);
  });

  it("the admin media list shows every upload, newest first", async () => {
    await seedMedia("bir");
    await seedMedia("iki");

    const res = await mediaRoutes.GET(jsonRequest("GET"));
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(2);
  });

  it("returns 404 when deleting an image that does not exist", async () => {
    const res = await mediaIdRoutes.DELETE(jsonRequest("DELETE"), routeParams("yok"));
    expect(res.status).toBe(404);
  });

  it("deleting an unused image leaves every public page untouched", async () => {
    const used = await seedMedia("kullanilan");
    const unused = await seedMedia("kullanilmayan");
    const post = await (
      await blogRoutes.POST(
        jsonRequest("POST", { title: "Yazı", excerpt: "x", thumbnailMediaId: used.id }),
      )
    ).json();

    await mediaIdRoutes.DELETE(jsonRequest("DELETE"), routeParams(unused.id));

    expect((await blogQueries.getBlogPostBySlug(post.slug))!.thumbnail).toBe(used.secureUrl);
    expect(await countRows("media")).toBe(1);
  });

  it("stores alt text so the public image can be described", async () => {
    const res = await mediaRoutes.POST(
      jsonRequest("POST", {
        cloudinaryPublicId: "ptob/afis",
        url: "https://res.cloudinary.com/ptob/image/upload/afis.jpg",
        secureUrl: "https://res.cloudinary.com/ptob/image/upload/afis.jpg",
        altText: "PTÖB yıllık buluşma afişi",
      }),
    );
    const created = await res.json();

    const row = await testClient.execute({
      sql: "SELECT alt_text FROM media WHERE id = ?",
      args: [created.id],
    });
    expect((row.rows[0] as unknown as { alt_text: string }).alt_text).toBe("PTÖB yıllık buluşma afişi");
  });
});
