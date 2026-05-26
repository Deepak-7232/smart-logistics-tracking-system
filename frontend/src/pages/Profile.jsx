import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  MdAccountCircle, MdEmail, MdPhone, MdBadge,
} from "react-icons/md";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import API from "../api/axios";
import Button from "../components/ui/Button";

export default function Profile() {
  const { user, setProfile } = useAuth();
  const [driver,   setDriver]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadProfile = async () => {
    if (!user?.email) return;
    try {
      const data = await authService.getMyProfile(user.email);
      setDriver(data);
      setProfile(data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, [user?.email]);

  const toggleAvailability = async () => {
    if (!driver) return;
    setUpdating(true);
    try {
      const newStatus = !driver.available;
      await API.put(`/drivers/availability/${driver.id}?available=${newStatus}`);
      setDriver({ ...driver, available: newStatus });
      setProfile({ available: newStatus });
      toast.success(`You are now marked as ${newStatus ? "Available" : "Unavailable"}`);
    } catch {
      toast.error("Failed to update availability");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-3">
          <div className="skeleton h-8 w-1/4 rounded" />
          <div className="card h-64" />
        </div>
      </MainLayout>
    );
  }

  const initials = driver?.name?.[0]?.toUpperCase() ?? "D";

  return (
    <MainLayout>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your driver account and availability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ── Left: Avatar + availability ── */}
        <div className="card p-6 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-primary-500/20 border border-primary-500/30
                          flex items-center justify-center mb-4">
            <span className="text-2xl font-semibold text-primary-400">{initials}</span>
          </div>
          <p className="text-sm font-semibold text-gray-100 mb-0.5">{driver?.name}</p>
          <p className="text-xs text-gray-600 mb-5">DRIVER</p>

          {/* Availability toggle */}
          <div className={`w-full p-4 rounded-lg border mb-4 ${
            driver?.available
              ? "bg-emerald-400/5 border-emerald-400/20"
              : "bg-red-400/5 border-red-400/20"
          }`}>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Current Status</p>
            <div className={`flex items-center justify-center gap-2 mb-3 text-sm font-semibold ${
              driver?.available ? "text-emerald-400" : "text-red-400"
            }`}>
              <span className={`w-2 h-2 rounded-full ${driver?.available ? "bg-emerald-400" : "bg-red-400"}`} />
              {driver?.available ? "Available" : "Unavailable"}
            </div>
            <Button
              onClick={toggleAvailability}
              loading={updating}
              variant={driver?.available ? "secondary" : "primary"}
              fullWidth
              size="sm"
            >
              {driver?.available ? "Mark Unavailable" : "Mark Available"}
            </Button>
          </div>

          {!driver?.available && (
            <p className="text-[11px] text-gray-700 italic text-center">
              You are currently unavailable for new assignments.
            </p>
          )}
        </div>

        {/* ── Right: Details ── */}
        <div className="card p-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <MdAccountCircle className="text-gray-600 text-base" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Personal Information</p>
          </div>
          <div className="space-y-0 divide-y divide-app-border">
            {[
              { label: "Email Address",  value: driver?.email,          Icon: MdEmail,   mono: false },
              { label: "Phone Number",   value: driver?.phone || "—",   Icon: MdPhone,   mono: false },
              { label: "License Number", value: driver?.licenseNumber || "—", Icon: MdBadge, mono: true },
            ].map(({ label, value, Icon, mono }) => (
              <div key={label} className="flex items-center gap-4 py-3.5">
                <Icon className="text-gray-700 flex-shrink-0 text-base" />
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="text-[11px] text-gray-600 uppercase tracking-wide shrink-0">{label}</span>
                  <span className={`text-sm text-gray-200 font-medium truncate ml-4 ${mono ? "font-mono" : ""}`}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
