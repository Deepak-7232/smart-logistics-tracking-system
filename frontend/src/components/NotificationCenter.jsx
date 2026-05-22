import { useState, useRef, useEffect } from "react";
import { MdNotifications, MdDone, MdLocalShipping, MdCheckCircle } from "react-icons/md";
import useShipmentStore from "../store/useShipmentStore";

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const notifications = useShipmentStore((s) => s.notifications);
  const markAllRead   = useShipmentStore((s) => s.markAllRead);
  const unread        = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl
                   bg-slate-800/60 border border-slate-700/50 text-slate-400
                   hover:text-slate-100 hover:bg-slate-700/60 transition-all duration-200"
      >
        <MdNotifications className="text-xl" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-500 rounded-full
                           flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-slate-950">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-80 glass-card bg-slate-900 border border-slate-700/80
                        shadow-2xl z-50 animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Notifications</h3>
              <p className="text-[10px] text-slate-500">{unread} unread</p>
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                <MdDone className="text-sm" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <MdCheckCircle className="text-3xl text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-600">All caught up!</p>
              </div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors
                    ${n.read ? "opacity-60" : "bg-primary-500/5"}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                    ${n.read ? "bg-slate-800 text-slate-500" : "bg-primary-500/20 text-primary-400"}`}>
                    <MdLocalShipping className="text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{timeAgo(n.time)}</p>
                  </div>
                  {!n.read && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
