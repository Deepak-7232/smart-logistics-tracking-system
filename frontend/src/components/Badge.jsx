const STATUS_STYLES = {
  PENDING:           "bg-amber-500/15 text-amber-400 border-amber-500/30",
  IN_TRANSIT:        "bg-blue-500/15 text-blue-400 border-blue-500/30",
  OUT_FOR_DELIVERY:  "bg-violet-500/15 text-violet-400 border-violet-500/30",
  DELIVERED:         "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  CANCELLED:         "bg-red-500/15 text-red-400 border-red-500/30",
  ACTIVE:            "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  INACTIVE:          "bg-slate-500/15 text-slate-400 border-slate-500/30",
  AVAILABLE:         "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
};

export default function Badge({ status }) {
  const style = STATUS_STYLES[status?.toUpperCase()] ?? "bg-slate-500/15 text-slate-400 border-slate-500/30";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status ?? "—"}
    </span>
  );
}
