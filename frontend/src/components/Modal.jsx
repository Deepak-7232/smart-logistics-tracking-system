import { useEffect } from "react";
import { MdClose } from "react-icons/md";

export default function Modal({ isOpen, onClose, title, children, size = "md", disableClose = false }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && !disableClose) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, disableClose]);

  if (!isOpen) return null;

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget && !disableClose) onClose(); }}
    >
      <div
        className={`relative bg-app-surface border border-app-border rounded-xl w-full ${widths[size]} shadow-modal animate-fade-in`}
      >
        {/* Loading overlay */}
        {disableClose && (
          <div className="absolute inset-0 bg-app-surface/60 z-10 rounded-xl pointer-events-auto" />
        )}

        {/* Header */}
        <div className="relative z-20 flex items-center justify-between px-5 py-4 border-b border-app-border">
          <h2 className="text-sm font-semibold text-gray-100">{title}</h2>
          <button
            onClick={() => { if (!disableClose) onClose(); }}
            disabled={disableClose}
            className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-150
                       ${disableClose
                         ? "text-gray-700 cursor-not-allowed"
                         : "text-gray-500 hover:text-gray-200 hover:bg-app-elevated"
                       }`}
          >
            <MdClose className="text-base" />
          </button>
        </div>

        {/* Body */}
        <div className="relative z-20 px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
