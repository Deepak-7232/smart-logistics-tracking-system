import { useLocation } from "react-router-dom";
import { MdSearch, MdWbSunny, MdNightlight } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationCenter from "../components/NotificationCenter";

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard",      sub: "Welcome back! Here's what's happening." },
  "/shipments": { title: "Shipments",      sub: "Manage and track all shipments." },
  "/drivers":   { title: "Drivers",        sub: "Manage your driver fleet." },
  "/vehicles":  { title: "Vehicles",       sub: "Monitor all registered vehicles." },
  "/track":     { title: "Track Shipment", sub: "Real-time shipment tracking." },
};

export default function Navbar() {
  const { pathname } = useLocation();
  const { user }     = useAuth();
  const { isDark, toggle } = useTheme();
  const { title, sub } = PAGE_TITLES[pathname] ?? { title: "LogiTrack", sub: "" };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80
                       bg-slate-950/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Left — page title */}
      <div>
        <h1 className="text-base font-bold text-slate-100 leading-tight">{title}</h1>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/60 border border-slate-700/50
                        rounded-xl px-3 py-1.5 text-slate-400 text-sm w-48 focus-within:w-64 transition-all duration-300">
          <MdSearch className="text-lg flex-shrink-0" />
          <input
            type="text"
            placeholder="Quick search…"
            className="bg-transparent outline-none placeholder-slate-500 text-slate-300 text-sm w-full"
          />
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50
                     text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 transition-all duration-200"
        >
          {isDark ? <MdWbSunny className="text-amber-400 text-xl" /> : <MdNightlight className="text-primary-400 text-xl" />}
        </button>

        {/* Notification center */}
        <NotificationCenter />

        {/* Avatar */}
        <div className="flex items-center gap-2 ml-1">
          {user?.role && (
            <span className="text-[10px] font-bold tracking-wider text-primary-400 bg-primary-500/10 px-2 py-1 rounded border border-primary-500/20">
              {user.role}
            </span>
          )}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600
                          flex items-center justify-center shadow-lg cursor-pointer">
            <span className="text-xs font-bold text-white">
              {user?.email?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
