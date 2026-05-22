import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { MdArrowUpward, MdArrowDownward, MdUnfoldMore, MdChevronLeft, MdChevronRight, MdInbox } from "react-icons/md";
import { SkeletonTable } from "./ui/Skeleton";

export default function DataTable({ columns, data = [], loading, emptyMessage = "No records found." }) {
  const [sorting,         setSorting]         = useState([]);
  const [globalFilter,    setGlobalFilter]     = useState("");
  const [pagination,      setPagination]       = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data,
    columns,
    state:            { sorting, globalFilter, pagination },
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
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 pt-4 gap-3 flex-wrap">
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search across all columns…"
          className="form-input py-2 text-sm max-w-xs"
        />
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            {totalFiltered} {totalFiltered === 1 ? "result" : "results"}
          </span>
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
          >
            {[10, 25, 50].map((n) => <option key={n} value={n}>Show {n}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getCanSort() ? "cursor-pointer select-none group" : ""}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-slate-600 group-hover:text-slate-400 transition-colors">
                          {header.column.getIsSorted() === "asc"  ? <MdArrowUpward   className="text-primary-400" /> :
                           header.column.getIsSorted() === "desc" ? <MdArrowDownward  className="text-primary-400" /> :
                                                                     <MdUnfoldMore className="text-xs opacity-50" />}
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
                <td colSpan={columns.length} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3 text-slate-600">
                    <MdInbox className="text-4xl opacity-30" />
                    <p className="text-sm">{emptyMessage}</p>
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

      {/* Pagination */}
      {totalFiltered > 0 && (
        <div className="flex items-center justify-between px-4 pb-4 flex-wrap gap-3">
          <p className="text-xs text-slate-500">
            Page {pageIndex + 1} of {table.getPageCount()} ·{" "}
            {pageIndex * pageSize + 1}–{Math.min((pageIndex + 1) * pageSize, totalFiltered)} of {totalFiltered}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400
                         hover:bg-slate-700 hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <MdChevronLeft className="text-xl" />
            </button>
            {Array.from({ length: Math.min(table.getPageCount(), 5) }).map((_, i) => {
              const startPage = Math.max(0, Math.min(pageIndex - 2, table.getPageCount() - 5));
              const p = startPage + i;
              return (
                <button
                  key={p}
                  onClick={() => table.setPageIndex(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                    ${p === pageIndex
                      ? "bg-primary-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-100"}`}
                >
                  {p + 1}
                </button>
              );
            })}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400
                         hover:bg-slate-700 hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <MdChevronRight className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
