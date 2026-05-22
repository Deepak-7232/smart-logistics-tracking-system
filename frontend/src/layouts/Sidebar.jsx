import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdLocalShipping,
  MdPeople,
  MdDirectionsCar,
  MdLocationSearching,
  MdLogout,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isAdmin = user?.role === "ADMIN";

  const links = [
    { to: "/dashboard", label: "Dashboard",  Icon: MdDashboard },
    { to: "/shipments", label: "Shipments",  Icon: MdLocalShipping },
    ...(isAdmin ? [
      { to: "/drivers",   label: "Drivers",    Icon: MdPeople },
      { to: "/vehicles",  label: "Vehicles",   Icon: MdDirectionsCar },
    ] : []),
    { to: "/track",     label: "Track",      Icon: MdLocationSearching },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar-bg flex flex-col z-40 border-r border-slate-800/80">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg">
          <MdLocalShipping className="text-white text-xl" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">LogiTrack</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Smart Logistics</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
          Main Menu
        </p>
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon className="text-xl flex-shrink-0" />
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 border-t border-slate-800/80 pt-4 space-y-2">
        {/* User badge */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {user?.email?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {user?.email ?? "User"}
            </p>
            <p className="text-[10px] text-slate-500 capitalize">{user?.role?.toLowerCase() ?? "User"}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400
                     hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 text-sm font-medium"
        >
          <MdLogout className="text-xl" />
          Logout
        </button>
      </div>
    </aside>
  );
}

