import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  MdArrowUpward, MdArrowDownward, MdUnfoldMore,
  MdChevronLeft, MdChevronRight, MdSearch, MdInbox,
} from "react-icons/md";
import { SkeletonTable } from "./ui/Skeleton";

export default function DataTable({ columns, data = [], loading, emptyMessage = "No records found." }) {
  const [sorting,      setSorting]      = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination,   setPagination]   = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data,
    columns,
    state:                  { sorting, globalFilter, pagination },
    onSortingChange:        setSorting,
    onGlobalFilterChange:   setGlobalFilter,
    onPaginationChange:     setPagination,
    getCoreRowModel:        getCoreRowModel(),
    getSortedRowModel:      getSortedRowModel(),
    getFilteredRowModel:    getFilteredRowModel(),
    getPaginationRowModel:  getPaginationRowModel(),
  });

  if (loading) return <SkeletonTable rows={6} cols={columns.length} />;

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalFiltered = table.getFilteredRowModel().rows.length;

  return (
    <div>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-app-border gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex items-center">
          <MdSearch className="absolute left-2.5 text-gray-600 text-base pointer-events-none" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search…"
            className="form-input pl-8 h-7 text-xs w-56 focus:w-72 transition-all duration-200"
          />
        </div>
        {/* Right controls */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gray-600">
            {totalFiltered} {totalFiltered === 1 ? "result" : "results"}
          </span>
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="bg-app-bg border border-app-border text-gray-400 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500/30 h-7"
          >
            {[10, 25, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-gray-700">
                          {header.column.getIsSorted() === "asc"  ? <MdArrowUpward   className="text-primary-400 text-xs" /> :
                           header.column.getIsSorted() === "desc" ? <MdArrowDownward  className="text-primary-400 text-xs" /> :
                                                                     <MdUnfoldMore     className="text-[10px] opacity-40" />}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-14">
                  <div className="flex flex-col items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 rounded-lg bg-app-elevated flex items-center justify-center">
                      <MdInbox className="text-xl text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{emptyMessage}</p>
                      {globalFilter && (
                        <p className="text-xs text-gray-700 mt-0.5">
                          Try adjusting your search query
                        </p>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalFiltered > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-app-border flex-wrap gap-2">
          <p className="text-[11px] text-gray-600">
            {pageIndex * pageSize + 1}–{Math.min((pageIndex + 1) * pageSize, totalFiltered)} of {totalFiltered}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-7 h-7 flex items-center justify-center rounded bg-app-elevated text-gray-500
                         hover:bg-app-ring hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed
                         transition-colors duration-150 border border-app-border"
            >
              <MdChevronLeft className="text-base" />
            </button>
            {Array.from({ length: Math.min(table.getPageCount(), 5) }).map((_, i) => {
              const startPage = Math.max(0, Math.min(pageIndex - 2, table.getPageCount() - 5));
              const p = startPage + i;
              return (
                <button
                  key={p}
                  onClick={() => table.setPageIndex(p)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors duration-150 border
                    ${p === pageIndex
                      ? "bg-primary-500 text-white border-primary-500"
                      : "bg-app-elevated text-gray-500 border-app-border hover:bg-app-ring hover:text-gray-200"
                    }`}
                >
                  {p + 1}
                </button>
              );
            })}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-7 h-7 flex items-center justify-center rounded bg-app-elevated text-gray-500
                         hover:bg-app-ring hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed
                         transition-colors duration-150 border border-app-border"
            >
              <MdChevronRight className="text-base" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
