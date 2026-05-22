/** Skeleton primitives for loading states */

export function SkeletonText({ className = "w-32 h-3" }) {
  return <div className={`bg-slate-800 rounded-full animate-pulse ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 w-24 bg-slate-700 rounded-full" />
        <div className="w-10 h-10 rounded-xl bg-slate-700" />
      </div>
      <div className="h-8 w-16 bg-slate-700 rounded-lg" />
      <div className="h-2.5 w-28 bg-slate-800 rounded-full mt-2" />
    </div>
  );
}

export function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="border-b border-slate-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-3 bg-slate-800 rounded-full animate-pulse" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="data-table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}>
                <div className="h-2.5 w-20 bg-slate-700 rounded-full animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
