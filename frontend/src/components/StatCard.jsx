export default function StatCard({ title, value, icon: Icon, color, trend, trendLabel }) {
  const colorMap = {
    indigo:  { bg: "from-indigo-600/20 to-indigo-900/10",  border: "border-indigo-500/20", icon: "bg-indigo-500/20 text-indigo-400",  val: "text-indigo-400" },
    violet:  { bg: "from-violet-600/20 to-violet-900/10",  border: "border-violet-500/20", icon: "bg-violet-500/20 text-violet-400",  val: "text-violet-400" },
    emerald: { bg: "from-emerald-600/20 to-emerald-900/10",border: "border-emerald-500/20",icon: "bg-emerald-500/20 text-emerald-400",val: "text-emerald-400" },
    amber:   { bg: "from-amber-600/20 to-amber-900/10",    border: "border-amber-500/20",  icon: "bg-amber-500/20 text-amber-400",    val: "text-amber-400" },
    rose:    { bg: "from-rose-600/20 to-rose-900/10",      border: "border-rose-500/20",   icon: "bg-rose-500/20 text-rose-400",      val: "text-rose-400" },
    cyan:    { bg: "from-cyan-600/20 to-cyan-900/10",      border: "border-cyan-500/20",   icon: "bg-cyan-500/20 text-cyan-400",      val: "text-cyan-400" },
  };

  const c = colorMap[color] ?? colorMap.indigo;

  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${c.bg} border ${c.border} group hover:scale-[1.02] transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
          <Icon className="text-xl" />
        </div>
      </div>
      <p className={`text-3xl font-bold ${c.val}`}>{value}</p>
      {trendLabel && (
        <p className="text-xs text-slate-500 mt-1.5">
          <span className={trend >= 0 ? "text-emerald-400" : "text-rose-400"}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>{" "}
          {trendLabel}
        </p>
      )}
    </div>
  );
}
