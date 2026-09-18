import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type AdminSession = {
  user: { id: string; name: string; email: string; role: string };
};

/**
 * Local-only escape hatch for working on the panel without an account.
 *
 * Three independent conditions must all hold, and none of them can be true on
 * a deployed production build:
 *   - the build is not a production build,
 *   - Vercel does not report a production environment,
 *   - the operator opted in explicitly with ADMIN_AUTH_BYPASS=1.
 *
 * `NODE_ENV` is inlined at build time by Next, so a production bundle has the
 * literal `false` here and the whole branch is dropped — the bypass cannot be
 * switched on later by setting an environment variable on the server.
 */
function bypassEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.VERCEL_ENV !== "production" &&
    process.env.ADMIN_AUTH_BYPASS === "1"
  );
}

const bypassSession: AdminSession = {
  user: {
    id: "dev-bypass",
    name: "Yerel geliştirici",
    email: "dev@localhost",
    role: "admin",
  },
};

/**
 * The session for a signed-in administrator, or null.
 *
 * A signed-in non-admin is treated exactly like a signed-out visitor: the role
 * check lives here rather than at each call site so a new admin page cannot
 * forget it.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (bypassEnabled()) return bypassSession;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  // `role` comes from the admin plugin and is not part of better-auth's base
  // user type, so it is read defensively rather than asserted.
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return null;

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role,
    },
  };
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
