export default function LoadingSpinner({ size = "md", message }) {
  const s = { sm: "w-5 h-5 border-2", md: "w-10 h-10 border-2", lg: "w-16 h-16 border-[3px]" }[size];
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className={`${s} border-slate-700 border-t-primary-500 rounded-full animate-spin`} />
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  );
}
