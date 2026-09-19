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

/*
  `activities` is the static icon list of what the association does in general
  ("Seminerler", "Multimedya Etkinlikleri") — distinct from `activity_posts`,
  which are write-ups of things that actually happened.
*/

type Handler = (req: Request, ctx?: unknown) => Promise<Response>;

let routes: { GET: Handler; POST: Handler };
let idRoutes: { GET: Handler; PUT: Handler; DELETE: Handler };
let publicQueries: typeof import("@/db/queries/activities");

beforeAll(async () => {
  await setupSchema();
  routes = (await import("@/app/api/admin/activities/route")) as unknown as typeof routes;
  idRoutes = (await import("@/app/api/admin/activities/[id]/route")) as unknown as typeof idRoutes;
  publicQueries = await import("@/db/queries/activities");
});

afterAll(closeHarness);
beforeEach(resetTables);

function createActivity(overrides: Record<string, unknown> = {}) {
  return routes.POST(
    jsonRequest("POST", {
      title: "Seminerler",
      description: "Düzenli akademik seminerler.",
      icon: "presentation",
      sortOrder: 0,
      ...overrides,
    }),
  );
}

describe("admin activities -> public homepage and /about-us", () => {
  it("a created activity appears in the public list", async () => {
    const res = await createActivity();
    expect(res.status).toBe(201);
    const created = await res.json();

    const all = await publicQueries.getAllActivities();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(created.id);
    expect(all[0].title).toBe("Seminerler");
    expect(all[0].description).toBe("Düzenli akademik seminerler.");
    expect(all[0].icon).toBe("presentation");
  });

  it("orders the public list by sortOrder", async () => {
    await createActivity({ title: "Üçüncü", sortOrder: 30 });
    await createActivity({ title: "Birinci", sortOrder: 10 });
    await createActivity({ title: "İkinci", sortOrder: 20 });

    const all = await publicQueries.getAllActivities();
    expect(all.map((a) => a.title)).toEqual(["Birinci", "İkinci", "Üçüncü"]);
  });

  it("an edit reaches the public list", async () => {
    const created = await (await createActivity()).json();

    const res = await idRoutes.PUT(
      jsonRequest("PUT", {
        title: "Multimedya Etkinlikleri",
        description: "Video ve podcast çalışmaları.",
        icon: "video",
        sortOrder: 5,
      }),
      routeParams(created.id),
    );
    expect(res.status).toBe(200);

    const all = await publicQueries.getAllActivities();
    expect(all[0].title).toBe("Multimedya Etkinlikleri");
    expect(all[0].icon).toBe("video");
    expect(all[0].sortOrder).toBe(5);
  });

  it("a deleted activity disappears from the public list", async () => {
    const created = await (await createActivity()).json();
    const res = await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(res.status).toBe(200);
    expect(await publicQueries.getAllActivities()).toHaveLength(0);
  });

  it("requires both a title and an icon", async () => {
    expect((await routes.POST(jsonRequest("POST", { icon: "video" }))).status).toBe(400);
    expect((await routes.POST(jsonRequest("POST", { title: "Başlık" }))).status).toBe(400);
    expect(await countRows("activities")).toBe(0);
  });

  it("revalidates the homepage and /about-us on every mutation", async () => {
    const created = await (await createActivity()).json();
    expect(revalidatedPaths).toContain("/");
    expect(revalidatedPaths).toContain("/about-us");

    revalidatedPaths.length = 0;
    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(revalidatedPaths).toContain("/about-us");
  });

  it("returns 404 for an unknown id", async () => {
    expect((await idRoutes.GET(jsonRequest("GET"), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.PUT(jsonRequest("PUT", { title: "x", icon: "y" }), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.DELETE(jsonRequest("DELETE"), routeParams("nope"))).status).toBe(404);
  });
});
