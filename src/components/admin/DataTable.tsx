import React from "react";
import { EmptyState, LoadingSkeleton } from "@/components/admin/AdminUi";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}

/**
 * The list table for every admin section.
 *
 * Re-skinned onto the ported `.admin-*` classes rather than rewritten: the
 * eleven list pages all render through this one component, so restyling here
 * converts them together and keeps them from drifting apart again. Their
 * column definitions and data loading are untouched.
 */
export default function DataTable<T extends { id: string }>({
  columns,
  data,
  actions,
  loading,
  emptyMessage = "Henüz kayıt bulunmuyor.",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="admin-card">
        <LoadingSkeleton className="mb-3 block h-5 w-1/3" />
        <LoadingSkeleton className="mb-3 block h-5 w-2/3" />
        <LoadingSkeleton className="block h-5 w-1/2" />
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title="Kayıt yok" description={emptyMessage} />;
  }

  return (
    <section className="admin-card admin-table-card">
      <div className="admin-table-scroll">
        <table className="admin-data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
              {actions && <th className="text-right">İşlemler</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
                {actions && (
                  <td>
                    <div className="admin-table-actions">{actions(item)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
