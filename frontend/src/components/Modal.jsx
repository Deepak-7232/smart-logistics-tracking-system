import { useEffect } from "react";
import { MdClose } from "react-icons/md";

export default function Modal({ isOpen, onClose, title, children, size = "md", disableClose = false }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && !disableClose) onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, disableClose]);

  if (!isOpen) return null;

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget && !disableClose) onClose(); }}
    >
      <div className={`relative glass-card bg-slate-900 border border-slate-700/80 w-full ${widths[size]} shadow-2xl animate-fade-in overflow-hidden`}>
        {disableClose && (
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] z-10 pointer-events-auto" />
        )}
        
        {/* Header */}
        <div className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-base font-semibold text-slate-100">{title}</h2>
          <button
            onClick={() => { if (!disableClose) onClose(); }}
            disabled={disableClose}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200
                       ${disableClose ? "text-slate-600 cursor-not-allowed" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"}`}
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="relative z-20 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

