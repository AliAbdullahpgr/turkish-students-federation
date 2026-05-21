import React from "react";

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

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  actions,
  loading,
  emptyMessage = "Henüz kayıt bulunmuyor.",
}: DataTableProps<T>) {
  if (loading) return <p className="text-text-muted">Yükleniyor...</p>;

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-card shadow-card border border-border-custom p-12 text-center">
        <p className="text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-card shadow-card border border-border-custom overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-custom text-left">
            {columns.map((col) => (
              <th key={col.key} className="p-4 text-sm font-semibold text-text-secondary">
                {col.header}
              </th>
            ))}
            {actions && (
              <th className="p-4 text-sm font-semibold text-text-secondary text-right">
                İşlemler
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-border-custom hover:bg-surface/50">
              {columns.map((col) => (
                <td key={col.key} className="p-4">
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
              {actions && (
                <td className="p-4 text-right">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
