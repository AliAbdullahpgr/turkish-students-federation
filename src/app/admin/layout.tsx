import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/admin/AdminLayout";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.isAdmin as boolean | undefined;

  if (!isAdmin) {
    redirect("/");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
