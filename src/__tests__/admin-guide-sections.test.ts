import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
  setupSchema,
  resetTables,
  closeHarness,
  jsonRequest,
  routeParams,
  countRows,
  revalidatedPaths,
} from "./helpers/admin-harness";

type Handler = (req: Request, ctx?: unknown) => Promise<Response>;

let routes: { GET: Handler; POST: Handler };
let idRoutes: { GET: Handler; PUT: Handler; DELETE: Handler };
let reorder: { PUT: Handler };
let publicQueries: typeof import("@/db/queries/guide-sections");

beforeAll(async () => {
  await setupSchema();
  routes = (await import("@/app/api/admin/guide-sections/route")) as unknown as typeof routes;
  idRoutes = (await import("@/app/api/admin/guide-sections/[id]/route")) as unknown as typeof idRoutes;
  reorder = (await import("@/app/api/admin/guide-sections/reorder/route")) as unknown as typeof reorder;
  publicQueries = await import("@/db/queries/guide-sections");
});

afterAll(closeHarness);
beforeEach(resetTables);

function createSection(overrides: Record<string, unknown> = {}) {
  return routes.POST(
    jsonRequest("POST", {
      title: "Vize İşlemleri",
      content: "Vize başvurusu nasıl yapılır.",
      level: 1,
      sortOrder: 0,
      isPublished: true,
      ...overrides,
    }),
  );
}

describe("admin guide sections -> public /pakistan-rehberi", () => {
  it("a created section appears in the public tree", async () => {
    const res = await createSection();
    expect(res.status).toBe(201);
    const created = await res.json();

    const tree = await publicQueries.getGuideSectionTree();
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe(created.id);
    expect(tree[0].title).toBe("Vize İşlemleri");
    expect(tree[0].content).toBe("Vize başvurusu nasıl yapılır.");
  });

  it("nests a child under its parent in the public tree", async () => {
    const parent = await (await createSection({ title: "Ulaşım", level: 1 })).json();
    const child = await (
      await createSection({ title: "Otobüs", level: 2, parentId: parent.id })
    ).json();

    const tree = await publicQueries.getGuideSectionTree();
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children![0].id).toBe(child.id);
    expect(tree[0].children![0].title).toBe("Otobüs");
  });

  it("unpublishing a section removes it from the public tree but keeps it in admin", async () => {
    const created = await (await createSection()).json();
    expect(await publicQueries.getGuideSectionTree()).toHaveLength(1);

    await idRoutes.PUT(
      jsonRequest("PUT", { title: created.title, isPublished: false, level: 1 }),
      routeParams(created.id),
    );

    expect(await publicQueries.getGuideSectionTree()).toHaveLength(0);
    expect(await publicQueries.getAllGuideSections()).toHaveLength(1);
  });

  it("only published top-level sections are offered publicly", async () => {
    await createSection({ title: "Görünür", level: 1, isPublished: true });
    await createSection({ title: "Gizli", level: 1, isPublished: false });

    const top = await publicQueries.getTopLevelGuideSections();
    expect(top.map((s) => s.title)).toEqual(["Görünür"]);
  });

  it("orders siblings by sortOrder in the public tree", async () => {
    await createSection({ title: "Üçüncü", sortOrder: 30 });
    await createSection({ title: "Birinci", sortOrder: 10 });
    await createSection({ title: "İkinci", sortOrder: 20 });

    const tree = await publicQueries.getGuideSectionTree();
    expect(tree.map((s) => s.title)).toEqual(["Birinci", "İkinci", "Üçüncü"]);
  });

  it("the reorder endpoint rearranges the public tree", async () => {
    const a = await (await createSection({ title: "A", sortOrder: 1 })).json();
    const b = await (await createSection({ title: "B", sortOrder: 2 })).json();

    const res = await reorder.PUT(
      jsonRequest("PUT", {
        items: [
          { id: a.id, sortOrder: 10 },
          { id: b.id, sortOrder: 5 },
        ],
      }),
    );
    expect(res.status).toBe(200);

    const tree = await publicQueries.getGuideSectionTree();
    expect(tree.map((s) => s.title)).toEqual(["B", "A"]);
  });

  it("the reorder endpoint can reparent a section", async () => {
    const parent = await (await createSection({ title: "Üst", level: 1 })).json();
    const loose = await (await createSection({ title: "Alt", level: 2 })).json();

    expect(await publicQueries.getGuideSectionTree()).toHaveLength(2);

    await reorder.PUT(
      jsonRequest("PUT", { items: [{ id: loose.id, parentId: parent.id, sortOrder: 0 }] }),
    );

    const tree = await publicQueries.getGuideSectionTree();
    expect(tree).toHaveLength(1);
    expect(tree[0].children!.map((c) => c.title)).toEqual(["Alt"]);
  });

  it("rejects a malformed reorder payload without changing anything", async () => {
    const a = await (await createSection({ title: "A", sortOrder: 1 })).json();

    expect((await reorder.PUT(jsonRequest("PUT", { items: "nope" }))).status).toBe(400);
    expect((await reorder.PUT(jsonRequest("PUT", { items: [{ id: a.id }] }))).status).toBe(400);
    expect((await reorder.PUT(jsonRequest("PUT", { items: [{ sortOrder: 1 }] }))).status).toBe(400);

    const tree = await publicQueries.getGuideSectionTree();
    expect(tree[0].sortOrder).toBe(1);
  });

  it("deleting a parent also removes its children from the public tree", async () => {
    const parent = await (await createSection({ title: "Üst", level: 1 })).json();
    await createSection({ title: "Alt", level: 2, parentId: parent.id });
    expect(await countRows("guide_sections")).toBe(2);

    const res = await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(parent.id));
    expect(res.status).toBe(200);

    expect(await publicQueries.getGuideSectionTree()).toHaveLength(0);
    expect(await countRows("guide_sections")).toBe(0);
  });

  it("deleting a grandparent leaves orphaned grandchildren behind", async () => {
    // Documents current behaviour: the delete handler removes the row and its
    // direct children only, so a third level survives with a parentId that no
    // longer resolves. Such a row is invisible in the public tree (it is never
    // reachable from a root) but still occupies the admin list.
    const root = await (await createSection({ title: "Kök", level: 1 })).json();
    const mid = await (await createSection({ title: "Orta", level: 2, parentId: root.id })).json();
    await createSection({ title: "Torun", level: 3, parentId: mid.id });

    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(root.id));

    expect(await publicQueries.getGuideSectionTree()).toHaveLength(0);
    expect(await countRows("guide_sections")).toBe(1);
    const orphan = (await publicQueries.getAllGuideSections())[0];
    expect(orphan.title).toBe("Torun");
    expect(orphan.parentId).toBe(mid.id);
  });

  it("clamps level to the documented 1-4 range", async () => {
    expect((await createSection({ level: 9 })).status).toBe(400);
    expect((await createSection({ level: 0 })).status).toBe(400);
  });

  it("requires a title", async () => {
    const res = await routes.POST(jsonRequest("POST", { level: 1 }));
    expect(res.status).toBe(400);
    expect(await countRows("guide_sections")).toBe(0);
  });

  it("revalidates /pakistan-rehberi on create, edit, reorder and delete", async () => {
    const created = await (await createSection()).json();
    expect(revalidatedPaths).toContain("/pakistan-rehberi");

    revalidatedPaths.length = 0;
    await idRoutes.PUT(jsonRequest("PUT", { title: "x", level: 1 }), routeParams(created.id));
    expect(revalidatedPaths).toContain("/pakistan-rehberi");

    revalidatedPaths.length = 0;
    await reorder.PUT(jsonRequest("PUT", { items: [{ id: created.id, sortOrder: 3 }] }));
    expect(revalidatedPaths).toContain("/pakistan-rehberi");

    revalidatedPaths.length = 0;
    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(revalidatedPaths).toContain("/pakistan-rehberi");
  });

  it("returns 404 for an unknown id", async () => {
    expect((await idRoutes.GET(jsonRequest("GET"), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.PUT(jsonRequest("PUT", { title: "x" }), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.DELETE(jsonRequest("DELETE"), routeParams("nope"))).status).toBe(404);
  });
});
