import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminApi = createRouteMatcher(["/api/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) || isAdminApi(req)) {
    await auth.protect();
    const { sessionClaims } = await auth();
    const metadata = sessionClaims?.publicMetadata as Record<string, unknown> | undefined;
    const isAdmin = metadata?.isAdmin;
    if (!isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webp).*)",
    "/api/(.*)",
  ],
};
