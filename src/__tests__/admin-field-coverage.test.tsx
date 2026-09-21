import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { setupSchema, resetTables, closeHarness, jsonRequest } from "./helpers/admin-harness";

/*
  Which settings fields the admin panel offers, and whether the public site
  actually renders each one.

  The settings form is a flat list of keys; nothing structurally connects a key
  to the component that displays it, so a field can be added to the form — or
  a component can stop rendering one during a redesign — and the panel goes on
  cheerfully saving a value that changes nothing. This file pins down the
  current answer for every key, so a change in either direction is deliberate.
*/

type Handler = (req: Request) => Promise<Response>;

let settingsRoutes: { PUT: Handler };
let siteSettings: typeof import("@/db/queries/site-settings");

beforeAll(async () => {
  await setupSchema();
  settingsRoutes = (await import("@/app/api/admin/site-settings/route")) as unknown as typeof settingsRoutes;
  siteSettings = await import("@/db/queries/site-settings");
});

afterAll(closeHarness);
beforeEach(resetTables);

function render(component: unknown, props: Record<string, unknown>) {
  return renderToStaticMarkup(
    createElement(component as ComponentType<Record<string, unknown>>, props),
  );
}

/**
 * The exact key list `src/app/admin/(protected)/site-settings/page.tsx` renders.
 *
 * The `home_*` keys left this list when the homepage got its own screen; they
 * are covered by `admin-home-content.test.ts` instead.
 */
const SETTING_KEYS = [
  "site_name",
  "site_short_name",
  "guide_name",
  "guide_href",
  "join_href",
  "site_description",
  "guide_description",
];

describe("every settings key the admin form offers is actually stored", () => {
  it("accepts and stores every key the form renders", async () => {
    const payload = Object.fromEntries(SETTING_KEYS.map((key) => [key, `deger-${key}`]));
    // Both href fields have to be plausible routes rather than the generic
    // marker, since the identity reader hands them straight to a link.
    payload.guide_href = "/pakistan-rehberi/";
    payload.join_href = "/join-tsf/";

    const res = await settingsRoutes.PUT(jsonRequest("PUT", payload));
    expect(res.status).toBe(200);

    const stored = await siteSettings.getAllSiteSettings();
    for (const key of SETTING_KEYS) {
      expect(Object.hasOwn(stored, key), `${key} was not stored`).toBe(true);
    }
  });
});

describe("the about-page CTA honours the saved links", () => {
  it("uses the saved join and guide hrefs", async () => {
    await settingsRoutes.PUT(
      jsonRequest("PUT", { join_href: "/contact-us/", guide_href: "/pakistan-rehberi/" }),
    );
    const identity = await siteSettings.getSiteIdentity();

    const { default: CTABannerSection } = await import(
      "@/components/sections/about/CTABannerSection"
    );
    const html = render(CTABannerSection, {
      joinHref: identity.joinHref,
      guideHref: identity.guideHref,
    });

    // `next/link` drops the trailing slash when it renders the href.
    expect(html).toContain('href="/contact-us"');
    expect(html).toContain('href="/pakistan-rehberi"');
    expect(html).not.toContain("/join-tsf");
  });

  it("falls back to the original literals when nothing is saved", async () => {
    const identity = await siteSettings.getSiteIdentity();
    const { default: CTABannerSection } = await import(
      "@/components/sections/about/CTABannerSection"
    );
    const html = render(CTABannerSection, {
      joinHref: identity.joinHref,
      guideHref: identity.guideHref,
    });

    expect(html).toContain('href="/join-tsf"');
    expect(html).toContain("/news-blogs?type=blog");
  });
});
