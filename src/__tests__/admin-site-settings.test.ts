import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
  setupSchema,
  resetTables,
  closeHarness,
  jsonRequest,
  countRows,
  revalidatedPaths,
  testClient,
} from "./helpers/admin-harness";

type Handler = (req: Request) => Promise<Response>;

let routes: { GET: Handler; PUT: Handler };
let publicQueries: typeof import("@/db/queries/site-settings");

beforeAll(async () => {
  await setupSchema();
  routes = (await import("@/app/api/admin/site-settings/route")) as unknown as typeof routes;
  publicQueries = await import("@/db/queries/site-settings");
});

afterAll(closeHarness);
beforeEach(resetTables);

describe("admin site settings -> public site chrome", () => {
  it("saved identity settings reach the public identity reader", async () => {
    const res = await routes.PUT(
      jsonRequest("PUT", {
        site_name: "Pakistan Türk Öğrenci Birliği",
        site_short_name: "PTÖB",
        site_description: "Pakistan'daki Türk öğrencilerin çatı kuruluşu.",
        join_href: "/join-tsf/",
      }),
    );
    expect(res.status).toBe(200);

    const identity = await publicQueries.getSiteIdentity();
    expect(identity.name).toBe("Pakistan Türk Öğrenci Birliği");
    expect(identity.shortName).toBe("PTÖB");
    expect(identity.description).toBe("Pakistan'daki Türk öğrencilerin çatı kuruluşu.");
    expect(identity.joinHref).toBe("/join-tsf/");
  });

  it("refuses the home_* keys, which now belong to the homepage screen", async () => {
    await routes.PUT(
      jsonRequest("PUT", {
        home_title_top: "Pakistan'da",
        home_summary: "Kısa tanıtım metni.",
        home_about_intro: "Hakkımızda giriş metni.",
      }),
    );

    // `/admin/home` owns these through `saveHomeContent`, which validates the
    // links. Accepting them here too would let the two screens overwrite each
    // other depending on which was saved last.
    expect(await countRows("site_settings")).toBe(0);
  });

  it("updates an existing key in place instead of inserting a duplicate", async () => {
    await routes.PUT(jsonRequest("PUT", { site_name: "İlk Ad" }));
    await routes.PUT(jsonRequest("PUT", { site_name: "İkinci Ad" }));

    expect(await countRows("site_settings")).toBe(1);
    expect((await publicQueries.getSiteIdentity()).name).toBe("İkinci Ad");
  });

  it("ignores keys that are not in the editable set", async () => {
    await routes.PUT(
      jsonRequest("PUT", { president_name: "Sahte Başkan", youtube_title: "Sahte Video" }),
    );

    // These belong to their own validated server actions, so the settings
    // endpoint must not be a back door into them.
    expect(await countRows("site_settings")).toBe(0);
    expect((await publicQueries.getPresidentSection()).name).toBe("Ömer Abbas");
  });

  it("ignores a non-string value rather than storing it", async () => {
    await routes.PUT(jsonRequest("PUT", { site_name: 42 }));
    expect(await countRows("site_settings")).toBe(0);
  });

  it("trims whitespace so the public page never renders padded copy", async () => {
    await routes.PUT(jsonRequest("PUT", { site_name: "   Boşluklu Ad   " }));
    expect((await publicQueries.getSiteIdentity()).name).toBe("Boşluklu Ad");
  });

  it("caps a short field at 500 characters and a long field at 10000", async () => {
    await routes.PUT(
      jsonRequest("PUT", { site_name: "A".repeat(900), site_description: "B".repeat(12_000) }),
    );

    const settings = await publicQueries.getAllSiteSettings();
    expect(settings.site_name).toHaveLength(500);
    expect(settings.site_description).toHaveLength(10_000);
  });

  it("falls back to the shipped defaults when nothing has been saved", async () => {
    const identity = await publicQueries.getSiteIdentity();
    expect(identity.name).toBe("Pakistan Türk Öğrenci Birliği");
    expect(identity.shortName).toBe("PTÖB");
  });

  it("the admin GET reflects exactly what was saved", async () => {
    await routes.PUT(jsonRequest("PUT", { site_name: "Ad", guide_name: "Rehber" }));

    const res = await routes.GET(jsonRequest("GET"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ site_name: "Ad", guide_name: "Rehber" });
  });

  it("revalidates the root layout so every public page picks the change up", async () => {
    await routes.PUT(jsonRequest("PUT", { site_name: "Ad" }));
    expect(revalidatedPaths).toContain("/ (layout)");
  });

  it("a saved guide_name reaches the public identity reader", async () => {
    await routes.PUT(
      jsonRequest("PUT", { site_name: "Birlik Adı", guide_name: "Pakistan Rehberi" }),
    );

    // The settings endpoint accepts guide_name specifically so an editor can
    // name the guide separately from the association.
    const stored = await testClient.execute("SELECT value FROM site_settings WHERE key = 'guide_name'");
    expect((stored.rows[0] as unknown as { value: string }).value).toBe("Pakistan Rehberi");

    const identity = await publicQueries.getSiteIdentity();
    expect(identity.guideName).toBe("Pakistan Rehberi");
  });

  it("a saved guide_href reaches the public identity reader", async () => {
    await routes.PUT(jsonRequest("PUT", { guide_href: "/pakistan-rehberi/" }));

    const stored = await testClient.execute("SELECT value FROM site_settings WHERE key = 'guide_href'");
    expect((stored.rows[0] as unknown as { value: string }).value).toBe("/pakistan-rehberi/");

    const identity = await publicQueries.getSiteIdentity();
    expect(identity.guideHref).toBe("/pakistan-rehberi/");
  });

  it("a saved guide_description reaches the public identity reader", async () => {
    await routes.PUT(jsonRequest("PUT", { guide_description: "Rehber açıklaması." }));
    expect((await publicQueries.getSiteIdentity()).guideDescription).toBe("Rehber açıklaması.");
  });
});
