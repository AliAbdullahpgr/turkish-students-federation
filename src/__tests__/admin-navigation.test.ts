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
let publicQueries: typeof import("@/db/queries/navigation");

beforeAll(async () => {
  await setupSchema();
  routes = (await import("@/app/api/admin/navigation/route")) as unknown as typeof routes;
  idRoutes = (await import("@/app/api/admin/navigation/[id]/route")) as unknown as typeof idRoutes;
  reorder = (await import("@/app/api/admin/navigation/reorder/route")) as unknown as typeof reorder;
  publicQueries = await import("@/db/queries/navigation");
});

afterAll(closeHarness);
beforeEach(resetTables);

function createItem(overrides: Record<string, unknown> = {}) {
  return routes.POST(
    jsonRequest("POST", {
      label: "Hakkımızda",
      href: "/about-us/",
      sortOrder: 0,
      isVisible: true,
      ...overrides,
    }),
  );
}

describe("admin navigation -> public header and footer", () => {
  it("a created item appears in the public navigation tree", async () => {
    const res = await createItem();
    expect(res.status).toBe(201);

    const tree = await publicQueries.getNavigationTree();
    expect(tree).toHaveLength(1);
    expect(tree[0].label).toBe("Hakkımızda");
    expect(tree[0].href).toBe("/about-us/");
  });

  it("nests a child item under its parent", async () => {
    const parent = await (await createItem({ label: "Yayınlar", href: "/books/" })).json();
    await createItem({ label: "Bülten", href: "/newsletter/", parentId: parent.id });

    const tree = await publicQueries.getNavigationTree();
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children![0].label).toBe("Bülten");
    expect(tree[0].children![0].href).toBe("/newsletter/");
  });

  it("a parent with no children reports undefined rather than an empty array", async () => {
    await createItem();
    const tree = await publicQueries.getNavigationTree();
    expect(tree[0].children).toBeUndefined();
  });

  it("hiding an item removes it from the public navigation", async () => {
    const created = await (await createItem()).json();
    expect(await publicQueries.getNavigationTree()).toHaveLength(1);

    await idRoutes.PUT(
      jsonRequest("PUT", { label: created.label, href: created.href, isVisible: false }),
      routeParams(created.id),
    );

    expect(await publicQueries.getNavigationTree()).toHaveLength(0);
    expect(await publicQueries.getAllNavigationItems()).toHaveLength(1);
  });

  it("refuses an href that is not a real public route, so the menu cannot 404", async () => {
    const res = await createItem({ href: "/does-not-exist/" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/href must point to an existing public site route/);
    expect(await countRows("navigation_items")).toBe(0);
  });

  it("refuses a javascript: href", async () => {
    expect((await createItem({ href: "javascript:alert(1)" })).status).toBe(400);
    expect(await countRows("navigation_items")).toBe(0);
  });

  it("refuses an external href", async () => {
    expect((await createItem({ href: "https://example.org" })).status).toBe(400);
    expect(await countRows("navigation_items")).toBe(0);
  });

  it("accepts the site root", async () => {
    expect((await createItem({ href: "/" })).status).toBe(201);
    expect((await publicQueries.getNavigationTree())[0].href).toBe("/");
  });

  it("orders the public navigation by sortOrder", async () => {
    await createItem({ label: "Üçüncü", href: "/events/", sortOrder: 30 });
    await createItem({ label: "Birinci", href: "/about-us/", sortOrder: 10 });
    await createItem({ label: "İkinci", href: "/books/", sortOrder: 20 });

    const tree = await publicQueries.getNavigationTree();
    expect(tree.map((i) => i.label)).toEqual(["Birinci", "İkinci", "Üçüncü"]);
  });

  it("the reorder endpoint rearranges the public menu", async () => {
    const a = await (await createItem({ label: "A", href: "/about-us/", sortOrder: 1 })).json();
    const b = await (await createItem({ label: "B", href: "/books/", sortOrder: 2 })).json();

    const res = await reorder.PUT(
      jsonRequest("PUT", {
        items: [
          { id: a.id, sortOrder: 10 },
          { id: b.id, sortOrder: 5 },
        ],
      }),
    );
    expect(res.status).toBe(200);

    const tree = await publicQueries.getNavigationTree();
    expect(tree.map((i) => i.label)).toEqual(["B", "A"]);
  });

  it("the reorder endpoint can nest an item under another", async () => {
    const parent = await (await createItem({ label: "Üst", href: "/about-us/" })).json();
    const loose = await (await createItem({ label: "Alt", href: "/books/" })).json();
    expect(await publicQueries.getNavigationTree()).toHaveLength(2);

    await reorder.PUT(jsonRequest("PUT", { items: [{ id: loose.id, parentId: parent.id, sortOrder: 0 }] }));

    const tree = await publicQueries.getNavigationTree();
    expect(tree).toHaveLength(1);
    expect(tree[0].children!.map((c) => c.label)).toEqual(["Alt"]);
  });

  it("rejects a malformed reorder payload", async () => {
    expect((await reorder.PUT(jsonRequest("PUT", { items: "nope" }))).status).toBe(400);
    expect((await reorder.PUT(jsonRequest("PUT", { items: [{ id: "x" }] }))).status).toBe(400);
  });

  it("deleting a parent removes its children from the public menu too", async () => {
    const parent = await (await createItem({ label: "Üst", href: "/about-us/" })).json();
    await createItem({ label: "Alt", href: "/books/", parentId: parent.id });
    expect(await countRows("navigation_items")).toBe(2);

    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(parent.id));

    expect(await publicQueries.getNavigationTree()).toHaveLength(0);
    expect(await countRows("navigation_items")).toBe(0);
  });

  it("an edited label and href reach the public menu", async () => {
    const created = await (await createItem()).json();

    await idRoutes.PUT(
      jsonRequest("PUT", { label: "Etkinlikler", href: "/events/", isVisible: true }),
      routeParams(created.id),
    );

    const tree = await publicQueries.getNavigationTree();
    expect(tree[0].label).toBe("Etkinlikler");
    expect(tree[0].href).toBe("/events/");
  });

  it("requires both a label and an href", async () => {
    expect((await routes.POST(jsonRequest("POST", { href: "/about-us/" }))).status).toBe(400);
    expect((await routes.POST(jsonRequest("POST", { label: "Etiket" }))).status).toBe(400);
  });

  it("revalidates the root layout so header and footer both refresh", async () => {
    const created = await (await createItem()).json();
    expect(revalidatedPaths).toContain("/ (layout)");

    revalidatedPaths.length = 0;
    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(revalidatedPaths).toContain("/ (layout)");
  });

  it("returns 404 for an unknown id", async () => {
    expect((await idRoutes.GET(jsonRequest("GET"), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.PUT(jsonRequest("PUT", { label: "x", href: "/" }), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.DELETE(jsonRequest("DELETE"), routeParams("nope"))).status).toBe(404);
  });
});
