/* ── Skeleton shimmer components ── */

function SkeletonBlock({ className = "" }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="card p-5 border-l-2 border-l-app-border">
      <div className="flex items-center justify-between mb-3">
        <SkeletonBlock className="h-3 w-24 rounded" />
        <SkeletonBlock className="h-4 w-4 rounded" />
      </div>
      <SkeletonBlock className="h-7 w-16 rounded mb-2" />
      <SkeletonBlock className="h-2.5 w-32 rounded" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div>
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-app-border">
        <SkeletonBlock className="h-7 w-48 rounded-lg" />
        <SkeletonBlock className="h-6 w-20 rounded" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-app-border">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <SkeletonBlock className="h-3 w-20 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri} className="border-b border-app-border last:border-0">
              {Array.from({ length: cols }).map((_, ci) => (
                <td key={ci} className="px-4 py-3">
                  <SkeletonBlock className={`h-4 rounded ${ci === 0 ? "w-28" : ci % 2 === 0 ? "w-20" : "w-24"}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = "" }) {
  const widths = ["w-full", "w-4/5", "w-3/5"];
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock key={i} className={`h-3 ${widths[i % widths.length]} rounded`} />
      ))}
    </div>
  );
}

export default SkeletonBlock;
