import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "@/db/client";
import { schema } from "@/db/schema";

function vercelOrigin(hostname: string | undefined) {
  if (!hostname) return null;
  return hostname.startsWith("http") ? hostname : `https://${hostname}`;
}

/**
 * Preview deployments get a fresh hostname per build, so the trusted list is
 * assembled at runtime rather than pinned to one URL — otherwise every preview
 * rejects its own sign-in POST as a cross-origin request.
 */
const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  vercelOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  vercelOrigin(process.env.VERCEL_URL),
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  appName: "PTÖB Admin",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    /**
     * There is no public sign-up for this site. Accounts are created by a
     * maintainer with `npm run admin:create`; leaving the endpoint open would
     * let anyone register and then only the role check would stand between
     * them and the panel.
     */
    disableSignUp: true,
    autoSignIn: true,
    minPasswordLength: 12,
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});
