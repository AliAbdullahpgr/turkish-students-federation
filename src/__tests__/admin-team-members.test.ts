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
let publicQueries: typeof import("@/db/queries/team-members");

beforeAll(async () => {
  await setupSchema();
  routes = (await import("@/app/api/admin/team-members/route")) as unknown as typeof routes;
  idRoutes = (await import("@/app/api/admin/team-members/[id]/route")) as unknown as typeof idRoutes;
  publicQueries = await import("@/db/queries/team-members");
});

afterAll(closeHarness);
beforeEach(resetTables);

function createMember(overrides: Record<string, unknown> = {}) {
  return routes.POST(
    jsonRequest("POST", {
      name: "Ayşe Yılmaz",
      role: "Genel Sekreter",
      bio: "Karaçi'de makine mühendisliği okuyor.",
      order: 0,
      isActive: true,
      ...overrides,
    }),
  );
}

describe("admin team members -> public /about-us", () => {
  it("a created member shows on the public about page", async () => {
    const res = await createMember();
    expect(res.status).toBe(201);
    const created = await res.json();

    const active = await publicQueries.getActiveTeamMembers();
    expect(active).toHaveLength(1);
    expect(active[0].id).toBe(created.id);
    expect(active[0].name).toBe("Ayşe Yılmaz");
    expect(active[0].role).toBe("Genel Sekreter");
    expect(active[0].bio).toContain("makine mühendisliği");
  });

  it("deactivating a member hides them publicly but keeps them in the admin list", async () => {
    const created = await (await createMember()).json();
    expect(await publicQueries.getActiveTeamMembers()).toHaveLength(1);

    await idRoutes.PUT(
      jsonRequest("PUT", { name: created.name, role: created.role, isActive: false }),
      routeParams(created.id),
    );

    expect(await publicQueries.getActiveTeamMembers()).toHaveLength(0);
    expect(await publicQueries.getAllTeamMembers()).toHaveLength(1);
    expect(await countRows("team_members")).toBe(1);
  });

  it("reactivating puts the member back on the public page", async () => {
    const created = await (await createMember({ isActive: false })).json();
    expect(await publicQueries.getActiveTeamMembers()).toHaveLength(0);

    await idRoutes.PUT(
      jsonRequest("PUT", { name: created.name, role: created.role, isActive: true }),
      routeParams(created.id),
    );
    expect(await publicQueries.getActiveTeamMembers()).toHaveLength(1);
  });

  it("honours the order field on the public page", async () => {
    await createMember({ name: "Üçüncü", order: 3 });
    await createMember({ name: "Birinci", order: 1 });
    await createMember({ name: "İkinci", order: 2 });

    const active = await publicQueries.getActiveTeamMembers();
    expect(active.map((m) => m.name)).toEqual(["Birinci", "İkinci", "Üçüncü"]);
  });

  it("reordering through an edit changes the public order", async () => {
    const first = await (await createMember({ name: "A", order: 1 })).json();
    await createMember({ name: "B", order: 2 });

    await idRoutes.PUT(
      jsonRequest("PUT", { name: "A", role: first.role, order: 99, isActive: true }),
      routeParams(first.id),
    );

    const active = await publicQueries.getActiveTeamMembers();
    expect(active.map((m) => m.name)).toEqual(["B", "A"]);
  });

  it("surfaces the member photo as a public HTTPS URL", async () => {
    const media = await seedMedia("member-photo");
    await createMember({ photoMediaId: media.id });

    const active = await publicQueries.getActiveTeamMembers();
    expect(active[0].photo).toBe(media.secureUrl);
  });

  it("a member with no photo reads as null rather than breaking the join", async () => {
    await createMember();
    const active = await publicQueries.getActiveTeamMembers();
    expect(active[0].photo).toBeNull();
    expect(active[0].photoMediaId).toBeNull();
  });

  it("a deleted member disappears from the public page", async () => {
    const created = await (await createMember()).json();
    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(await publicQueries.getActiveTeamMembers()).toHaveLength(0);
    expect(await publicQueries.getAllTeamMembers()).toHaveLength(0);
  });

  it("requires both a name and a role", async () => {
    expect((await routes.POST(jsonRequest("POST", { role: "Başkan" }))).status).toBe(400);
    expect((await routes.POST(jsonRequest("POST", { name: "İsim" }))).status).toBe(400);
    expect(await countRows("team_members")).toBe(0);
  });

  it("rejects a non-integer order instead of silently storing it", async () => {
    const res = await createMember({ order: 1.5 });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/order must be an integer/);
  });

  it("revalidates /about-us on create, edit and delete", async () => {
    const created = await (await createMember()).json();
    expect(revalidatedPaths).toContain("/about-us");

    revalidatedPaths.length = 0;
    await idRoutes.PUT(
      jsonRequest("PUT", { name: "x", role: "y" }),
      routeParams(created.id),
    );
    expect(revalidatedPaths).toContain("/about-us");

    revalidatedPaths.length = 0;
    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(revalidatedPaths).toContain("/about-us");
  });
});
