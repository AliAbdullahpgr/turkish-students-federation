import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React from "react";

interface PageHeaderProps {
  title: string;
  backHref: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, backHref, action }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-4">
        <Link href={backHref} className="text-text-secondary hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary truncate">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}
