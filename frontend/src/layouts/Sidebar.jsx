import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard, MdLocalShipping, MdPeople, MdDirectionsCar,
  MdLocationSearching, MdLogout, MdAssignment,
  MdAccountCircle,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ROLES } from "../constants/roles";

export default function Sidebar() {
  const { logout, user, isAdmin, isDriver } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const admin  = isAdmin?.() ?? user?.role === ROLES.ADMIN;
  const driver = isDriver?.() ?? user?.role === ROLES.DRIVER;

  // ── ADMIN nav ─────────────────────────────────────────────────────────────
  const adminLinks = [
    { to: "/dashboard",  label: "Dashboard",  Icon: MdDashboard },
    { to: "/shipments",  label: "Shipments",  Icon: MdLocalShipping },
    { to: "/drivers",    label: "Drivers",    Icon: MdPeople },
    { to: "/vehicles",   label: "Vehicles",   Icon: MdDirectionsCar },
    { to: "/track",      label: "Track",      Icon: MdLocationSearching },
  ];

  // ── DRIVER nav ────────────────────────────────────────────────────────────
  const driverLinks = [
    { to: "/dashboard",     label: "Dashboard",     Icon: MdDashboard },
    { to: "/my-shipments",  label: "My Shipments",  Icon: MdAssignment },
    { to: "/my-vehicle",    label: "My Vehicle",    Icon: MdDirectionsCar },
    { to: "/profile",       label: "My Profile",    Icon: MdAccountCircle },
  ];

  const links = admin ? adminLinks : driverLinks;
  const avatarGradient = admin
    ? "from-primary-500 to-violet-600"
    : "from-cyan-500 to-sky-600";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar-bg flex flex-col z-40 border-r border-slate-800/80">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center shadow-lg`}>
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
          {admin ? "Admin Menu" : "Driver Menu"}
        </p>
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <Icon className="text-xl flex-shrink-0" />
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 border-t border-slate-800/80 pt-4 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/60">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center flex-shrink-0`}>
            <span className="text-xs font-bold text-white">
              {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {user?.name ?? user?.email ?? "User"}
            </p>
            <p className="text-[10px] capitalize" style={{ color: admin ? "#818cf8" : "#22d3ee" }}>
              {user?.role?.toLowerCase() ?? "user"}
            </p>
          </div>
        </div>

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
