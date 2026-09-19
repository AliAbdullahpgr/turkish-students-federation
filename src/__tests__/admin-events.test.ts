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
let publicQueries: typeof import("@/db/queries/events");

beforeAll(async () => {
  await setupSchema();
  routes = (await import("@/app/api/admin/events/route")) as unknown as typeof routes;
  idRoutes = (await import("@/app/api/admin/events/[id]/route")) as unknown as typeof idRoutes;
  publicQueries = await import("@/db/queries/events");
});

afterAll(closeHarness);
beforeEach(resetTables);

function createEvent(overrides: Record<string, unknown> = {}) {
  return routes.POST(
    jsonRequest("POST", {
      title: "PTÖB Yıllık Buluşması",
      category: "Buluşma",
      status: "upcoming",
      date: "2026-11-20",
      location: "İslamabad",
      ...overrides,
    }),
  );
}

describe("admin events -> public /events", () => {
  it("a created event appears in the public list with all its fields", async () => {
    const res = await createEvent();
    expect(res.status).toBe(201);
    const created = await res.json();

    const all = await publicQueries.getAllEvents();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(created.id);
    expect(all[0].title).toBe("PTÖB Yıllık Buluşması");
    expect(all[0].location).toBe("İslamabad");
    expect(all[0].date).toBe("2026-11-20");
    expect(all[0].category).toBe("Buluşma");
  });

  it("routes an event to the upcoming or recent list by its status", async () => {
    await createEvent({ title: "Gelecek Etkinlik", status: "upcoming" });
    await createEvent({ title: "Geçmiş Etkinlik", status: "recent" });

    expect((await publicQueries.getUpcomingEvents()).map((e) => e.title)).toEqual(["Gelecek Etkinlik"]);
    expect((await publicQueries.getRecentEvents()).map((e) => e.title)).toEqual(["Geçmiş Etkinlik"]);
  });

  it("moving an event from upcoming to recent moves it between public lists", async () => {
    const created = await (await createEvent({ status: "upcoming" })).json();
    expect(await publicQueries.getUpcomingEvents()).toHaveLength(1);

    const res = await idRoutes.PUT(
      jsonRequest("PUT", { title: created.title, status: "recent" }),
      routeParams(created.id),
    );
    expect(res.status).toBe(200);

    expect(await publicQueries.getUpcomingEvents()).toHaveLength(0);
    expect((await publicQueries.getRecentEvents()).map((e) => e.id)).toEqual([created.id]);
  });

  it("falls back to 'upcoming' for an unrecognised status rather than writing junk", async () => {
    const created = await (await createEvent({ status: "sometime-maybe" })).json();
    expect(created.status).toBe("upcoming");
    expect(await publicQueries.getUpcomingEvents()).toHaveLength(1);
  });

  it("surfaces the poster image as a public HTTPS URL", async () => {
    const media = await seedMedia("event-poster");
    const created = await (await createEvent({ posterMediaId: media.id })).json();

    const all = await publicQueries.getAllEvents();
    expect(all[0].posterImage).toBe(media.secureUrl);
    expect(await publicQueries.getEventById(created.id)).toMatchObject({ posterImage: media.secureUrl });
  });

  it("clearing the poster on an edit removes the image publicly", async () => {
    const media = await seedMedia("event-poster");
    const created = await (await createEvent({ posterMediaId: media.id })).json();
    expect((await publicQueries.getAllEvents())[0].posterImage).toBe(media.secureUrl);

    await idRoutes.PUT(
      jsonRequest("PUT", { title: created.title, status: "upcoming", posterMediaId: null }),
      routeParams(created.id),
    );

    const all = await publicQueries.getAllEvents();
    expect(all[0].posterMediaId).toBeNull();
    expect(all[0].posterImage).toBeNull();
  });

  it("an edited title and location reach the public list", async () => {
    const created = await (await createEvent()).json();
    await idRoutes.PUT(
      jsonRequest("PUT", {
        title: "Yeni Başlık",
        status: "upcoming",
        location: "Lahor",
        date: "2027-01-05",
      }),
      routeParams(created.id),
    );

    const all = await publicQueries.getAllEvents();
    expect(all[0].title).toBe("Yeni Başlık");
    expect(all[0].location).toBe("Lahor");
    expect(all[0].date).toBe("2027-01-05");
  });

  it("a deleted event disappears from the public list", async () => {
    const created = await (await createEvent()).json();
    const res = await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(res.status).toBe(200);
    expect(await publicQueries.getAllEvents()).toHaveLength(0);
    expect(await countRows("events")).toBe(0);
  });

  it("requires a title and writes nothing without one", async () => {
    const res = await routes.POST(jsonRequest("POST", { status: "upcoming" }));
    expect(res.status).toBe(400);
    expect(await countRows("events")).toBe(0);
  });

  it("revalidates the homepage and /events on create, edit and delete", async () => {
    const created = await (await createEvent()).json();
    expect(revalidatedPaths).toContain("/");
    expect(revalidatedPaths).toContain("/events");

    revalidatedPaths.length = 0;
    await idRoutes.PUT(jsonRequest("PUT", { title: "x", status: "recent" }), routeParams(created.id));
    expect(revalidatedPaths).toContain("/events");

    revalidatedPaths.length = 0;
    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(revalidatedPaths).toContain("/events");
  });

  it("returns 404 for an unknown id on read, edit and delete", async () => {
    expect((await idRoutes.GET(jsonRequest("GET"), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.PUT(jsonRequest("PUT", { title: "x" }), routeParams("nope"))).status).toBe(404);
    expect((await idRoutes.DELETE(jsonRequest("DELETE"), routeParams("nope"))).status).toBe(404);
  });
});
