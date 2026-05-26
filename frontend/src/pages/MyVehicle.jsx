import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  MdDirectionsCar, MdRefresh, MdLocalShipping, MdCheckCircle,
  MdPerson, MdEmail, MdPhone, MdBadge,
} from "react-icons/md";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

export default function MyVehicle() {
  const { user, setProfile } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [driver,  setDriver]  = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const driverProfile = await authService.getMyProfile(user.email);
      setDriver(driverProfile);
      setProfile(driverProfile);
      setVehicle(driverProfile.vehicleAssigned ? { vehicleNumber: driverProfile.vehicleAssigned } : null);
    } catch {
      toast.error("Failed to load vehicle info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user?.email]);

  const vehicleNumber = driver?.vehicleAssigned ?? user?.vehicleAssigned;

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-3">
          <div className="skeleton h-8 w-1/3 rounded" />
          <div className="card h-48" />
          <div className="card h-32" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1>My Vehicle</h1>
          <p>Your assigned fleet vehicle</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-app-surface
                     border border-app-border text-gray-500 hover:text-gray-200 hover:bg-app-elevated
                     transition-colors duration-150"
        >
          <MdRefresh className="text-sm" /> Refresh
        </button>
      </div>

      {!vehicleNumber ? (
        /* ── Empty state ── */
        <div className="card">
          <div className="empty-state py-16">
            <div className="empty-state-icon"><MdDirectionsCar /></div>
            <h3>No vehicle assigned</h3>
            <p>Your administrator hasn't assigned a vehicle to you yet</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Vehicle card */}
          <div className="card p-5 border-l-2 border-l-cyan-500 md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded bg-app-elevated border border-app-border flex items-center justify-center flex-shrink-0">
                <MdDirectionsCar className="text-gray-500 text-lg" />
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider">Assigned Vehicle</p>
                <p className="font-mono text-lg font-semibold text-gray-100">{vehicleNumber}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-app-border">
                <span className="text-[11px] text-gray-600 uppercase tracking-wide">Number</span>
                <span className="text-xs font-mono font-medium text-gray-200">{vehicleNumber}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[11px] text-gray-600 uppercase tracking-wide">Status</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-400/8 border border-emerald-400/20 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                </span>
              </div>
            </div>
          </div>

          {/* Driver info card */}
          <div className="card p-5 md:col-span-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">My Details</p>
            <div className="space-y-0 divide-y divide-app-border">
              {[
                { label: "Name",    value: driver?.name           ?? "—", Icon: MdPerson },
                { label: "Email",   value: driver?.email          ?? user?.email ?? "—", Icon: MdEmail },
                { label: "Phone",   value: driver?.phone          ?? "—", Icon: MdPhone },
                { label: "License", value: driver?.licenseNumber  ?? "—", Icon: MdBadge },
              ].map(({ label, value, Icon }) => (
                <div key={label} className="flex items-center gap-4 py-3">
                  <Icon className="text-gray-700 flex-shrink-0 text-base" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-[11px] text-gray-600 uppercase tracking-wide">{label}</span>
                    <span className={`text-sm text-gray-200 font-medium ${label === "License" ? "font-mono" : ""}`}>
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
