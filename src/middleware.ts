import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminApi = createRouteMatcher(["/api/admin(.*)"]);
const isSignUpRoute = createRouteMatcher(["/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isSignUpRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAdminRoute(req) || isAdminApi(req)) {
    await auth.protect();
    const { sessionClaims } = await auth();
    const metadata = sessionClaims?.publicMetadata as Record<string, unknown> | undefined;
    const isAdmin = metadata?.isAdmin;
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webp).*)",
    "/api/(.*)",
  ],
};
