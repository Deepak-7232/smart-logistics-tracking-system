import { clsx } from "clsx";

const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950";

const variants = {
  primary:   "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/30 focus:ring-primary-500",
  secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 focus:ring-slate-500",
  danger:    "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 focus:ring-red-500",
  ghost:     "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-100 focus:ring-slate-600",
  success:   "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 focus:ring-emerald-500",
};

const sizes = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={clsx(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin flex-shrink-0" />
      )}
      {children}
    </button>
  );
}
