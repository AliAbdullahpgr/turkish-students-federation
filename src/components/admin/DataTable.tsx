"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
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

const PAGE_SIZE = 20;
/** Below this many rows a search box is clutter; the whole list fits on screen. */
const SEARCH_THRESHOLD = 10;

/**
 * The list table for every admin section.
 *
 * Re-skinned onto the ported `.admin-*` classes rather than rewritten: the
 * list pages all render through this one component, so search and paging added
 * here reach every one of them. Their column definitions and data loading are
 * untouched. The search matches the raw value of each column, in Turkish
 * casing, so "ISLAMABAD" finds "İslamabad".
 */
export default function DataTable<T extends { id: string }>({
  columns,
  data,
  actions,
  loading,
  emptyMessage = "Henüz kayıt bulunmuyor.",
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const term = query.trim().toLocaleLowerCase("tr-TR");
  const filtered = useMemo(() => {
    if (!term) return data;
    return data.filter((item) =>
      columns.some((col) =>
        String((item as Record<string, unknown>)[col.key] ?? "")
          .toLocaleLowerCase("tr-TR")
          .includes(term),
      ),
    );
  }, [data, columns, term]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // A deleted row can leave the current page past the end; step back.
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

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

  const showSearch = data.length > SEARCH_THRESHOLD;

  return (
    <div className="space-y-3">
      {showSearch && (
        <div className="pl-search-filter">
          <Search className="pl-icon" aria-hidden="true" />
          <label className="sr-only" htmlFor="admin-table-search">
            Listede ara
          </label>
          <input
            id="admin-table-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Listede ara…"
            autoComplete="off"
          />
        </div>
      )}

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
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)}>“{query.trim()}” için sonuç bulunamadı.</td>
                </tr>
              ) : (
                rows.map((item) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {(showSearch || pageCount > 1) && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-text-secondary">
          <span role="status">
            {filtered.length === data.length ? `${data.length} kayıt` : `${filtered.length} / ${data.length} kayıt`}
          </span>
          {pageCount > 1 && (
            <nav className="flex items-center gap-2" aria-label="Sayfalama">
              <button
                type="button"
                className="admin-button admin-button-secondary"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                Önceki
              </button>
              <span>
                {current} / {pageCount}
              </span>
              <button
                type="button"
                className="admin-button admin-button-secondary"
                disabled={current === pageCount}
                onClick={() => setPage(current + 1)}
              >
                Sonraki
              </button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
