import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard, MdLocalShipping, MdPeople, MdDirectionsCar,
  MdLocationSearching, MdLogout, MdAssignment, MdAccountCircle,
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

  const adminLinks = [
    { to: "/dashboard", label: "Dashboard", Icon: MdDashboard },
    { to: "/shipments", label: "Shipments", Icon: MdLocalShipping },
    { to: "/drivers",   label: "Drivers",   Icon: MdPeople },
    { to: "/vehicles",  label: "Vehicles",  Icon: MdDirectionsCar },
    { to: "/track",     label: "Track",     Icon: MdLocationSearching },
  ];

  const driverLinks = [
    { to: "/dashboard",    label: "Dashboard",   Icon: MdDashboard },
    { to: "/my-shipments", label: "My Shipments", Icon: MdAssignment },
    { to: "/my-vehicle",   label: "My Vehicle",   Icon: MdDirectionsCar },
    { to: "/profile",      label: "My Profile",   Icon: MdAccountCircle },
  ];

  const links = admin ? adminLinks : driverLinks;

  const initials = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U";
  const displayName = user?.name ?? user?.email ?? "User";
  const roleLabel = user?.role?.toLowerCase() ?? "user";

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40"
      style={{ backgroundColor: 'var(--color-sidebar-bg)', borderRight: '1px solid var(--color-sidebar-border)', transition: 'background-color 200ms' }}
    >
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: '1px solid var(--color-sidebar-border)' }}>
        <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center flex-shrink-0">
          <MdLocalShipping className="text-white text-sm" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--color-text-primary)' }}>LogiTrack</p>
          <p className="text-[10px] leading-tight" style={{ color: 'var(--color-text-muted)' }}>Logistics Platform</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-faint)' }}>
          {admin ? "Operations" : "Driver"}
        </p>
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <Icon className="text-base flex-shrink-0" />
            <span className="text-sm leading-none">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── User section ── */}
      <div className="px-2 py-3 space-y-1" style={{ borderTop: '1px solid var(--color-sidebar-border)' }}>
        {/* User info row */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary-400">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate leading-tight" style={{ color: 'var(--color-text-primary)' }}>{displayName}</p>
            <p className="text-[10px] capitalize leading-tight" style={{ color: 'var(--color-text-muted)' }}>{roleLabel}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500/70 hover:text-red-400 hover:bg-red-500/5"
        >
          <MdLogout className="text-base flex-shrink-0" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
