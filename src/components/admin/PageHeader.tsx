import React from "react";
import { AdminPageHeader } from "@/components/admin/AdminUi";

interface PageHeaderProps {
  title: string;
  backHref: string;
  action?: React.ReactNode;
}

/**
 * Kept as a thin re-export so the existing edit pages keep their default
 * import and pick up the ported header styling, including the back link.
 * New pages use `AdminPageHeader` directly, which also takes an eyebrow and
 * a description.
 */
export default function PageHeader({ title, backHref, action }: PageHeaderProps) {
  return <AdminPageHeader title={title} backHref={backHref} action={action} />;
}
