import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth-guard";

/**
 * Every page in this group is behind the admin session check. `requireAdmin`
 * redirects to /admin/login when there is no session or the signed-in user is
 * not an administrator.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return <AdminShell userName={session.user.name}>{children}</AdminShell>;
}
