import { clsx } from "clsx";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-lg " +
  "transition-colors duration-150 active:scale-[0.98] " +
  "disabled:opacity-40 disabled:cursor-not-allowed " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-app-bg";

const variants = {
  primary:
    "bg-primary-500 hover:bg-primary-600 text-white " +
    "focus:ring-primary-500/40",
  secondary:
    "bg-app-surface hover:bg-app-elevated border border-app-border hover:border-app-ring " +
    "text-gray-300 hover:text-gray-100 focus:ring-gray-500/30",
  danger:
    "bg-transparent hover:bg-red-500/10 border border-red-500/30 hover:border-red-500/50 " +
    "text-red-400 hover:text-red-300 focus:ring-red-500/30",
  ghost:
    "bg-transparent hover:bg-app-elevated text-gray-400 hover:text-gray-100 " +
    "focus:ring-gray-600/30",
  success:
    "bg-transparent hover:bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 " +
    "text-emerald-400 hover:text-emerald-300 focus:ring-emerald-500/30",
};

const sizes = {
  sm: "text-xs px-3 py-1.5 h-7",
  md: "text-sm px-4 py-2 h-8",
  lg: "text-sm px-5 py-2.5 h-10",
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
        <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin flex-shrink-0" />
      )}
      {children}
    </button>
  );
}
