import { useLocation } from "react-router-dom";
import { MdSearch, MdWbSunny, MdNightlight } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationCenter from "../components/NotificationCenter";
import { ROLES } from "../constants/roles";

const PAGE_META = {
  "/dashboard":    { title: "Dashboard" },
  "/shipments":    { title: "Shipments" },
  "/drivers":      { title: "Drivers" },
  "/vehicles":     { title: "Vehicles" },
  "/track":        { title: "Track Shipment" },
  "/my-shipments": { title: "My Shipments" },
  "/my-vehicle":   { title: "My Vehicle" },
  "/profile":      { title: "My Profile" },
};

export default function Navbar() {
  const { pathname }       = useLocation();
  const { user }           = useAuth();
  const { isDark, toggle } = useTheme();

  const meta     = PAGE_META[pathname] ?? { title: "LogiTrack" };
  const isAdmin  = user?.role === ROLES.ADMIN;
  const initials = user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header
      className="flex items-center justify-between px-5 sticky top-0 z-30"
      style={{ height: '52px', backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', transition: 'background-color 200ms, border-color 200ms' }}
    >
      {/* Left — page title */}
      <h1 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{meta.title}</h1>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 rounded-lg px-2.5 py-1.5 w-44 focus-within:w-60 transition-all duration-200"
          style={{ backgroundColor: 'var(--color-elevated)', border: '1px solid var(--color-border)' }}
        >
          <MdSearch className="text-sm flex-shrink-0" style={{ color: 'var(--color-text-faint)' }} />
          <input
            type="text"
            placeholder="Search…"
            className="bg-transparent outline-none text-xs w-full"
            style={{ color: 'var(--color-text-primary)' }}
          />
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={isDark ? "Light mode" : "Dark mode"}
          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600
                     hover:text-gray-300 hover:bg-app-elevated transition-colors duration-150"
        >
          {isDark
            ? <MdWbSunny className="text-base text-amber-500" />
            : <MdNightlight className="text-base text-primary-400" />
          }
        </button>

        {/* Notifications */}
        <NotificationCenter />

        {/* Divider */}
        <div className="w-px h-5 bg-app-border mx-1" />

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-primary-500/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-400">{initials}</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-medium text-gray-300 leading-tight">{user?.email}</p>
            <p className={`text-[10px] leading-tight ${isAdmin ? "text-primary-400" : "text-cyan-400"}`}>
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
