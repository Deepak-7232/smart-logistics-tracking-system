import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  MdLocalShipping, MdLocationOn, MdPerson, MdDirectionsCar,
  MdRefresh, MdCheckCircle, MdSchedule, MdTrendingUp, MdCancel,
} from "react-icons/md";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const STATUS_OPTIONS = ["IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const STATUS_STYLES = {
  PENDING:          "bg-amber-500/15 text-amber-400 border-amber-500/20",
  IN_TRANSIT:       "bg-blue-500/15 text-blue-400 border-blue-500/20",
  OUT_FOR_DELIVERY: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  DELIVERED:        "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  CANCELLED:        "bg-red-500/15 text-red-400 border-red-500/20",
};

export default function MyShipments() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [updating,  setUpdating]  = useState(null); // trackingId being updated

  const fetchMyShipments = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await API.get(`/shipments/my-shipments/${encodeURIComponent(user.email)}`);
      setShipments(res.data);
    } catch {
      toast.error("Failed to load shipments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyShipments(); }, [user?.email]);

  const updateStatus = async (trackingId, status) => {
    setUpdating(trackingId);
    try {
      await API.put(`/shipments/update-status/${trackingId}?status=${status}`);
      toast.success(`Status updated to ${status}`);
      fetchMyShipments();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const delivered   = shipments.filter((s) => s.status === "DELIVERED").length;
  const inTransit   = shipments.filter((s) => s.status === "IN_TRANSIT").length;
  const pending     = shipments.filter((s) => s.status === "PENDING").length;

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">My Shipments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {shipments.length} assigned shipment{shipments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={fetchMyShipments}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl bg-slate-800/60
                     border border-slate-700/40 text-slate-400 hover:text-slate-200 transition-all"
        >
          <MdRefresh className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Delivered",  count: delivered, color: "emerald", Icon: MdCheckCircle },
          { label: "In Transit", count: inTransit, color: "blue",    Icon: MdTrendingUp },
          { label: "Pending",    count: pending,   color: "amber",   Icon: MdSchedule },
        ].map(({ label, count, color, Icon }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center flex-shrink-0`}>
              <Icon className={`text-${color}-400 text-xl`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-2xl font-bold text-${color}-400`}>{count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shipments list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-1/3 mb-3" />
              <div className="h-3 bg-slate-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : shipments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <MdLocalShipping className="text-5xl text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No shipments assigned yet</p>
          <p className="text-slate-600 text-sm mt-1">Your admin will assign shipments to you</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shipments.map((s) => (
            <div key={s.id} className="glass-card p-5 hover:border-slate-600/60 transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left info */}
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded">
                      {s.trackingId}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${STATUS_STYLES[s.status] ?? STATUS_STYLES.PENDING}`}>
                      {s.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-slate-300">
                    <MdLocationOn className="text-slate-500 flex-shrink-0" />
                    <span className="truncate">
                      <span className="text-slate-400">{s.source}</span>
                      <span className="text-slate-600 mx-1">→</span>
                      <span className="text-slate-300">{s.destination}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MdPerson className="text-slate-600" />
                      {s.senderName} → {s.receiverName}
                    </span>
                    {s.vehicleAssigned && (
                      <span className="flex items-center gap-1 text-cyan-400">
                        <MdDirectionsCar />
                        {s.vehicleAssigned}
                      </span>
                    )}
                  </div>
                </div>

                {/* Update Status */}
                {s.status !== "DELIVERED" && s.status !== "CANCELLED" && (
                  <div className="flex-shrink-0">
                    <p className="text-[10px] text-slate-600 mb-1.5 uppercase tracking-wider">Update Status</p>
                    <div className="flex flex-wrap gap-1.5">
                      {STATUS_OPTIONS.filter((opt) => opt !== s.status).map((opt) => (
                        <button
                          key={opt}
                          disabled={updating === s.trackingId}
                          onClick={() => updateStatus(s.trackingId, opt)}
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all
                            ${opt === "DELIVERED"
                              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                              : opt === "CANCELLED"
                              ? "text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                              : "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20"
                            } disabled:opacity-40`}
                        >
                          {updating === s.trackingId ? "…" : opt.replace(/_/g, " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(s.status === "DELIVERED" || s.status === "CANCELLED") && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    {s.status === "DELIVERED"
                      ? <><MdCheckCircle className="text-emerald-600" /> Completed</>
                      : <><MdCancel className="text-red-600" /> Cancelled</>
                    }
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
