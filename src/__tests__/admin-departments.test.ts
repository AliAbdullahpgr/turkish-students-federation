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

type Handler = (req: Request, ctx?: unknown) => Promise<Response>;

let routes: { GET: Handler; POST: Handler };
let idRoutes: { GET: Handler; PUT: Handler; DELETE: Handler };
let publicQueries: typeof import("@/db/queries/departments");

beforeAll(async () => {
  await setupSchema();
  routes = (await import("@/app/api/admin/departments/route")) as unknown as typeof routes;
  idRoutes = (await import("@/app/api/admin/departments/[id]/route")) as unknown as typeof idRoutes;
  publicQueries = await import("@/db/queries/departments");
});

afterAll(closeHarness);
beforeEach(resetTables);

function createDepartment(overrides: Record<string, unknown> = {}) {
  return routes.POST(
    jsonRequest("POST", {
      name: "Medya & Yayınlar",
      summary: "Dijital varlığı yönetir.",
      icon: "📢",
      body: "## Hakkımızda\n\nBirim metni.",
      sortOrder: 0,
      isPublished: true,
      ...overrides,
    }),
  );
}

describe("admin departments -> public /departments", () => {
  it("a created department shows on the public list and on its own page", async () => {
    const res = await createDepartment();
    expect(res.status).toBe(201);
    const created = await res.json();
    expect(created.slug).toBe("medya-yayinlar");

    const list = await publicQueries.getPublishedDepartments();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe("Medya & Yayınlar");
    expect(list[0].summary).toBe("Dijital varlığı yönetir.");

    const page = await publicQueries.getDepartmentBySlug("medya-yayinlar");
    expect(page?.body).toContain("Birim metni.");
    expect(page?.icon).toBe("📢");
  });

  it("editing text and headings changes what the public page returns", async () => {
    const created = await (await createDepartment()).json();

    const res = await idRoutes.PUT(
      jsonRequest("PUT", {
        name: "Medya ve İletişim",
        slug: "medya-ve-iletisim",
        summary: "Yeni özet.",
        body: "Yeni gövde.",
        icon: "🎙️",
      }),
      routeParams(created.id),
    );
    expect(res.status).toBe(200);

    expect(await publicQueries.getDepartmentBySlug("medya-yayinlar")).toBeUndefined();
    const page = await publicQueries.getDepartmentBySlug("medya-ve-iletisim");
    expect(page?.name).toBe("Medya ve İletişim");
    expect(page?.summary).toBe("Yeni özet.");
    expect(page?.body).toBe("Yeni gövde.");
    expect(page?.icon).toBe("🎙️");
    expect(await countRows("departments")).toBe(1);
  });

  it("stores a hero image and resolves it to a URL", async () => {
    const hero = await seedMedia("dept-hero");
    const created = await (await createDepartment({ heroMediaId: hero.id })).json();

    const page = await publicQueries.getDepartmentBySlug(created.slug);
    expect(page?.heroMediaId).toBe(hero.id);
    expect(page?.hero).toBe(hero.secureUrl);

    await idRoutes.PUT(jsonRequest("PUT", { name: created.name, heroMediaId: null }), routeParams(created.id));
    const cleared = await publicQueries.getDepartmentBySlug(created.slug);
    expect(cleared?.hero).toBeNull();
  });

  it("round-trips members in order, with and without photos", async () => {
    const photo = await seedMedia("member-photo");
    const created = await (
      await createDepartment({
        members: [
          { name: "Ayşe Yılmaz", role: "Birim Başkanı", photoMediaId: photo.id },
          { name: "Ali Veli", role: "Üye" },
        ],
      })
    ).json();

    let page = await publicQueries.getDepartmentBySlug(created.slug);
    expect(page?.members.map((m) => m.name)).toEqual(["Ayşe Yılmaz", "Ali Veli"]);
    expect(page?.members[0].photo).toBe(photo.secureUrl);
    expect(page?.members[1].photo).toBeNull();

    // Reorder and drop one: the saved list is the new truth, not a merge.
    await idRoutes.PUT(
      jsonRequest("PUT", {
        name: created.name,
        members: [{ name: "Ali Veli", role: "Birim Başkanı" }],
      }),
      routeParams(created.id),
    );
    page = await publicQueries.getDepartmentBySlug(created.slug);
    expect(page?.members).toHaveLength(1);
    expect(page?.members[0]).toMatchObject({ name: "Ali Veli", role: "Birim Başkanı", photo: null });
  });

  it("round-trips gallery images with captions in order", async () => {
    const a = await seedMedia("gal-a");
    const b = await seedMedia("gal-b");
    const created = await (
      await createDepartment({
        gallery: [
          { mediaId: b.id, caption: "İkinci" },
          { mediaId: a.id, caption: "" },
        ],
      })
    ).json();

    const page = await publicQueries.getDepartmentBySlug(created.slug);
    expect(page?.gallery.map((g) => g.url)).toEqual([b.secureUrl, a.secureUrl]);
    expect(page?.gallery[0].caption).toBe("İkinci");
  });

  it("a gallery entry whose media was deleted resolves to a null URL instead of breaking the page", async () => {
    const a = await seedMedia("gal-gone");
    const created = await (await createDepartment({ gallery: [{ mediaId: a.id, caption: "x" }] })).json();
    await testClient.execute({ sql: "DELETE FROM media WHERE id = ?", args: [a.id] });

    const page = await publicQueries.getDepartmentBySlug(created.slug);
    expect(page?.gallery[0].url).toBeNull();
  });

  it("unpublishing hides a department publicly but keeps it in the admin list", async () => {
    const created = await (await createDepartment()).json();
    await idRoutes.PUT(jsonRequest("PUT", { name: created.name, isPublished: false }), routeParams(created.id));

    expect(await publicQueries.getPublishedDepartments()).toHaveLength(0);
    expect(await publicQueries.getDepartmentBySlug(created.slug)).toBeUndefined();
    expect(await publicQueries.getAllDepartments()).toHaveLength(1);
    expect(await (await routes.GET(jsonRequest("GET"))).json()).toHaveLength(1);
  });

  it("orders departments by sortOrder", async () => {
    await createDepartment({ name: "Üçüncü", sortOrder: 3 });
    await createDepartment({ name: "Birinci", sortOrder: 1 });
    await createDepartment({ name: "İkinci", sortOrder: 2 });

    const names = (await publicQueries.getPublishedDepartments()).map((d) => d.name);
    expect(names).toEqual(["Birinci", "İkinci", "Üçüncü"]);
  });

  it("deleting removes the department everywhere", async () => {
    const created = await (await createDepartment()).json();
    const res = await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(res.status).toBe(200);
    expect(await countRows("departments")).toBe(0);
    expect(await publicQueries.getDepartmentBySlug(created.slug)).toBeUndefined();
  });

  it("revalidates the list and the detail page on every write", async () => {
    const created = await (await createDepartment()).json();
    expect(revalidatedPaths).toEqual(expect.arrayContaining(["/departments", "/departments/medya-yayinlar"]));

    revalidatedPaths.length = 0;
    await idRoutes.PUT(jsonRequest("PUT", { name: created.name, slug: "yeni-adres" }), routeParams(created.id));
    expect(revalidatedPaths).toEqual(
      expect.arrayContaining(["/departments", "/departments/medya-yayinlar", "/departments/yeni-adres"]),
    );

    revalidatedPaths.length = 0;
    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(revalidatedPaths).toContain("/departments/yeni-adres");
  });
});

describe("admin departments validation", () => {
  it("rejects a missing name with 400 and writes nothing", async () => {
    const res = await createDepartment({ name: "  " });
    expect(res.status).toBe(400);
    expect(await countRows("departments")).toBe(0);
  });

  it("answers 409 for a duplicate slug on create and on update", async () => {
    await createDepartment({ name: "Birim A" });
    const second = await (await createDepartment({ name: "Birim B" })).json();

    expect((await createDepartment({ name: "Birim A" })).status).toBe(409);

    const res = await idRoutes.PUT(
      jsonRequest("PUT", { name: "Birim B", slug: "birim-a" }),
      routeParams(second.id),
    );
    expect(res.status).toBe(409);
    expect((await publicQueries.getDepartmentById(second.id))?.slug).toBe("birim-b");
  });

  it("rejects a member without a name and a gallery entry without media", async () => {
    expect((await createDepartment({ members: [{ role: "Üye" }] })).status).toBe(400);
    expect((await createDepartment({ gallery: [{ caption: "x" }] })).status).toBe(400);
    expect((await createDepartment({ members: "nope" })).status).toBe(400);
    expect((await createDepartment({ members: ["x"] })).status).toBe(400);
    expect(await countRows("departments")).toBe(0);
  });

  it("caps list sizes", async () => {
    const members = Array.from({ length: 61 }, (_, i) => ({ name: `Üye ${i}`, role: "" }));
    expect((await createDepartment({ members })).status).toBe(400);
  });

  it("rejects a bad sortOrder", async () => {
    expect((await createDepartment({ sortOrder: -1 })).status).toBe(400);
    expect((await createDepartment({ sortOrder: "x" })).status).toBe(400);
  });

  it("returns 404 for an unknown id on get, update and delete", async () => {
    expect((await idRoutes.GET(jsonRequest("GET"), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.PUT(jsonRequest("PUT", { name: "x" }), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.DELETE(jsonRequest("DELETE"), routeParams("nope"))).status).toBe(404);
  });

  it("survives corrupt stored JSON by showing empty lists", async () => {
    const created = await (await createDepartment()).json();
    await testClient.execute({
      sql: "UPDATE departments SET members = ?, gallery = ? WHERE id = ?",
      args: ["{not json", "42", created.id],
    });
    const page = await publicQueries.getDepartmentBySlug(created.slug);
    expect(page?.members).toEqual([]);
    expect(page?.gallery).toEqual([]);
  });
});
