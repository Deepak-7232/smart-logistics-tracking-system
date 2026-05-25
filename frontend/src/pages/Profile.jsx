import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  MdAccountCircle, MdEmail, MdPhone, MdBadge, MdToggleOn, MdToggleOff,
} from "react-icons/md";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import API from "../api/axios";
import Button from "../components/ui/Button";

export default function Profile() {
  const { user, setProfile, logout } = useAuth();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadProfile = async () => {
    if (!user?.email) return;
    try {
      const data = await authService.getMyProfile(user.email);
      setDriver(data);
      setProfile(data); // update global store
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
      setProfile({ available: newStatus }); // sync to store
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
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-1/4" />
          <div className="glass-card h-64" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-100">My Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your driver account and availability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Avatar & Availability */}
        <div className="space-y-6">
          <div className="glass-card p-6 text-center border-t-4 border-t-cyan-500">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-sky-600
                            flex items-center justify-center mx-auto mb-4 shadow-lg text-4xl text-white font-bold">
              {driver?.name?.[0]?.toUpperCase() ?? "D"}
            </div>
            <h2 className="text-lg font-bold text-slate-100">{driver?.name}</h2>
            <p className="text-sm text-cyan-400 font-medium mb-6">DRIVER</p>
            
            <div className={`p-4 rounded-xl border ${driver?.available ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Current Status</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                {driver?.available ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5"><MdToggleOn className="text-2xl" /> Available</span>
                ) : (
                  <span className="text-red-400 font-bold flex items-center gap-1.5"><MdToggleOff className="text-2xl" /> Unavailable</span>
                )}
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
              <p className="text-[10px] text-slate-500 mt-3 italic">
                You are currently unavailable for new assignments.
              </p>
            )}
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <MdAccountCircle className="text-cyan-400 text-lg" /> Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <MdEmail className="text-slate-400 text-xl flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm text-slate-200 font-medium">{driver?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <MdPhone className="text-slate-400 text-xl flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm text-slate-200 font-medium">{driver?.phone || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <MdBadge className="text-slate-400 text-xl flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">License Number</p>
                  <p className="text-sm text-slate-200 font-medium font-mono">{driver?.licenseNumber || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
