import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  MdDirectionsCar, MdRefresh, MdLocalShipping, MdSpeed,
  MdInventory, MdCheckCircle,
} from "react-icons/md";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import API from "../api/axios";

export default function MyVehicle() {
  const { user, setProfile } = useAuth();
  const [vehicle,  setVehicle]  = useState(null);
  const [driver,   setDriver]   = useState(null);
  const [loading,  setLoading]  = useState(true);

  const loadData = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      // 1. Get own driver profile (has vehicleAssigned string)
      const driverProfile = await authService.getMyProfile(user.email);
      setDriver(driverProfile);
      setProfile(driverProfile); // keep auth store in sync

      // 2. Find vehicle details from /vehicles/all (ADMIN endpoint — skip if DRIVER)
      //    Instead, we show the vehicle number from the driver profile directly.
      //    If you want full vehicle data, an admin must grant access to /vehicles/by-number.
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
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-1/3" />
          <div className="glass-card h-48" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">My Vehicle</h1>
          <p className="text-xs text-slate-500 mt-0.5">Your assigned fleet vehicle</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl bg-slate-800/60
                     border border-slate-700/40 text-slate-400 hover:text-slate-200 transition-all"
        >
          <MdRefresh /> Refresh
        </button>
      </div>

      {!vehicleNumber ? (
        <div className="glass-card p-12 text-center">
          <MdDirectionsCar className="text-6xl text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-medium text-lg">No Vehicle Assigned</p>
          <p className="text-slate-600 text-sm mt-2">
            Your admin hasn't assigned a vehicle to you yet.
          </p>
        </div>
      ) : (
        <>
          {/* Vehicle hero card */}
          <div className="glass-card p-6 mb-4 border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-sky-500/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600
                              flex items-center justify-center shadow-lg">
                <MdDirectionsCar className="text-white text-3xl" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Assigned Vehicle</p>
                <p className="text-2xl font-bold text-white">{vehicleNumber}</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Vehicle Number", value: vehicleNumber, Icon: MdLocalShipping, color: "cyan" },
                { label: "Status",         value: "Active",      Icon: MdCheckCircle,   color: "emerald" },
              ].map(({ label, value, Icon, color }) => (
                <div key={label} className="bg-slate-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`text-${color}-400`} />
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                  <p className={`font-semibold text-${color}-400`}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Driver info card */}
          <div className="glass-card p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">My Details</p>
            <div className="space-y-2">
              {[
                ["Name",    driver?.name           ?? "—"],
                ["Email",   driver?.email          ?? user?.email ?? "—"],
                ["Phone",   driver?.phone          ?? "—"],
                ["License", driver?.licenseNumber  ?? "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-slate-800/60 last:border-0">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-sm text-slate-300 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}
