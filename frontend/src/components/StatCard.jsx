/* ── StatCard — flat, operational, data-focused ── */
export default function StatCard({ title, value, icon: Icon, color, trend, trendLabel }) {
  const accentMap = {
    indigo:  { border: "border-l-primary-500",  trend: "text-primary-400" },
    violet:  { border: "border-l-violet-500",   trend: "text-violet-400" },
    emerald: { border: "border-l-emerald-500",  trend: "text-emerald-400" },
    amber:   { border: "border-l-amber-500",    trend: "text-amber-400" },
    rose:    { border: "border-l-red-500",      trend: "text-red-400" },
    cyan:    { border: "border-l-cyan-500",     trend: "text-cyan-400" },
  };

  const c = accentMap[color] ?? accentMap.indigo;

  return (
    <div
      className={`card p-5 border-l-2 ${c.border} hover:bg-app-elevated transition-colors duration-150`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        {Icon && (
          <Icon className="text-base text-gray-600 flex-shrink-0" />
        )}
      </div>
      <p className="text-2xl font-semibold text-gray-100 tracking-tight leading-none mb-2">
        {value}
      </p>
      {trendLabel && (
        <div className="flex items-center gap-1">
          <span className={`text-[11px] font-medium ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
          <span className="text-[11px] text-gray-600">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
