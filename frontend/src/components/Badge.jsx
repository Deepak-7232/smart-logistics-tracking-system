/* Status badge — flat, enterprise style */
const STATUS_CONFIG = {
  PENDING:          { dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/8",   border: "border-amber-400/20",   label: "Pending" },
  IN_TRANSIT:       { dot: "bg-primary-400", text: "text-primary-400", bg: "bg-primary-400/8", border: "border-primary-400/20", label: "In Transit" },
  OUT_FOR_DELIVERY: { dot: "bg-violet-400",  text: "text-violet-400",  bg: "bg-violet-400/8",  border: "border-violet-400/20",  label: "Out for Delivery" },
  DELIVERED:        { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/8", border: "border-emerald-400/20", label: "Delivered" },
  CANCELLED:        { dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-400/8",     border: "border-red-400/20",     label: "Cancelled" },
  ACTIVE:           { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/8", border: "border-emerald-400/20", label: "Active" },
  INACTIVE:         { dot: "bg-gray-500",    text: "text-gray-400",    bg: "bg-gray-500/8",    border: "border-gray-500/20",    label: "Inactive" },
  AVAILABLE:        { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/8", border: "border-emerald-400/20", label: "Available" },
  IN_USE:           { dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/8",   border: "border-amber-400/20",   label: "In Use" },
  MAINTENANCE:      { dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-400/8",     border: "border-red-400/20",     label: "Maintenance" },
  UNAVAILABLE:      { dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-400/8",     border: "border-red-400/20",     label: "Unavailable" },
};

export default function Badge({ status }) {
  const key = status?.toUpperCase().replace(/ /g, "_");
  const c = STATUS_CONFIG[key] ?? {
    dot: "bg-gray-500",
    text: "text-gray-400",
    bg: "bg-gray-500/8",
    border: "border-gray-500/20",
    label: status ?? "—",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}
