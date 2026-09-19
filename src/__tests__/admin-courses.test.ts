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
let publicQueries: typeof import("@/db/queries/courses");

beforeAll(async () => {
  await setupSchema();
  routes = (await import("@/app/api/admin/courses/route")) as unknown as typeof routes;
  idRoutes = (await import("@/app/api/admin/courses/[id]/route")) as unknown as typeof idRoutes;
  publicQueries = await import("@/db/queries/courses");
});

afterAll(closeHarness);
beforeEach(resetTables);

function createCourse(overrides: Record<string, unknown> = {}) {
  return routes.POST(
    jsonRequest("POST", {
      title: "Urduca Başlangıç Kursu",
      instructor: "Dr. Kamran",
      description: "Sıfırdan Urduca öğrenin.",
      href: "/literature/",
      ...overrides,
    }),
  );
}

describe("admin courses -> public homepage", () => {
  it("a created course appears in the public list", async () => {
    const res = await createCourse();
    expect(res.status).toBe(201);
    const created = await res.json();

    const all = await publicQueries.getAllCourses();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(created.id);
    expect(all[0].title).toBe("Urduca Başlangıç Kursu");
    expect(all[0].instructor).toBe("Dr. Kamran");
    expect(all[0].description).toBe("Sıfırdan Urduca öğrenin.");
    expect(all[0].href).toBe("/literature/");
  });

  it("surfaces the course thumbnail as a public HTTPS URL", async () => {
    const media = await seedMedia("course-thumb");
    await createCourse({ thumbnailMediaId: media.id });

    const all = await publicQueries.getAllCourses();
    expect(all[0].thumbnail).toBe(media.secureUrl);
  });

  it("accepts an external HTTPS link", async () => {
    const res = await createCourse({ href: "https://example.org/kurs" });
    expect(res.status).toBe(201);
    expect((await publicQueries.getAllCourses())[0].href).toBe("https://example.org/kurs");
  });

  it("refuses a javascript: href so it can never reach the public page", async () => {
    const res = await createCourse({ href: "javascript:alert(1)" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/href must be/);
    expect(await countRows("courses")).toBe(0);
  });

  it("refuses a plain-HTTP external href", async () => {
    const res = await createCourse({ href: "http://insecure.example.org" });
    expect(res.status).toBe(400);
    expect(await countRows("courses")).toBe(0);
  });

  it("refuses an unknown site-relative route", async () => {
    const res = await createCourse({ href: "/not-a-real-page/" });
    expect(res.status).toBe(400);
  });

  it("refuses a protocol-relative href that would leave the site", async () => {
    const res = await createCourse({ href: "//evil.example.org/x" });
    expect(res.status).toBe(400);
    expect(await countRows("courses")).toBe(0);
  });

  it("defaults a blank href to '#' rather than rejecting the course", async () => {
    const res = await createCourse({ href: "" });
    expect(res.status).toBe(201);
    expect((await publicQueries.getAllCourses())[0].href).toBe("#");
  });

  it("an edit reaches the public list, and a bad href on edit is refused", async () => {
    const created = await (await createCourse()).json();

    const ok = await idRoutes.PUT(
      jsonRequest("PUT", { title: "Yeni Kurs Adı", instructor: "Dr. Zehra", href: "/books/" }),
      routeParams(created.id),
    );
    expect(ok.status).toBe(200);
    let all = await publicQueries.getAllCourses();
    expect(all[0].title).toBe("Yeni Kurs Adı");
    expect(all[0].instructor).toBe("Dr. Zehra");
    expect(all[0].href).toBe("/books/");

    const bad = await idRoutes.PUT(
      jsonRequest("PUT", { title: "Yeni Kurs Adı", href: "javascript:alert(1)" }),
      routeParams(created.id),
    );
    expect(bad.status).toBe(400);
    all = await publicQueries.getAllCourses();
    expect(all[0].href).toBe("/books/");
  });

  it("a deleted course disappears from the public list", async () => {
    const created = await (await createCourse()).json();
    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(await publicQueries.getAllCourses()).toHaveLength(0);
  });

  it("requires a title", async () => {
    const res = await routes.POST(jsonRequest("POST", { instructor: "Biri" }));
    expect(res.status).toBe(400);
    expect(await countRows("courses")).toBe(0);
  });

  it("revalidates the homepage on create, edit and delete", async () => {
    const created = await (await createCourse()).json();
    expect(revalidatedPaths).toContain("/");

    revalidatedPaths.length = 0;
    await idRoutes.PUT(jsonRequest("PUT", { title: "x", href: "#" }), routeParams(created.id));
    expect(revalidatedPaths).toContain("/");

    revalidatedPaths.length = 0;
    await idRoutes.DELETE(jsonRequest("DELETE"), routeParams(created.id));
    expect(revalidatedPaths).toContain("/");
  });
});
