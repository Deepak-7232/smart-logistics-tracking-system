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

const STATUS_CLASSES = {
  PENDING:          "text-amber-400 bg-amber-400/8 border-amber-400/20",
  IN_TRANSIT:       "text-primary-400 bg-primary-400/8 border-primary-400/20",
  OUT_FOR_DELIVERY: "text-violet-400 bg-violet-400/8 border-violet-400/20",
  DELIVERED:        "text-emerald-400 bg-emerald-400/8 border-emerald-400/20",
  CANCELLED:        "text-red-400 bg-red-400/8 border-red-400/20",
};

const STATUS_DOT = {
  PENDING:          "bg-amber-400",
  IN_TRANSIT:       "bg-primary-400",
  OUT_FOR_DELIVERY: "bg-violet-400",
  DELIVERED:        "bg-emerald-400",
  CANCELLED:        "bg-red-400",
};

export default function MyShipments() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [updating,  setUpdating]  = useState(null);

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

  const delivered = shipments.filter((s) => s.status === "DELIVERED").length;
  const inTransit = shipments.filter((s) => s.status === "IN_TRANSIT").length;
  const pending   = shipments.filter((s) => s.status === "PENDING").length;

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1>My Shipments</h1>
          <p>{shipments.length} assigned shipment{shipments.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={fetchMyShipments}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-app-surface
                     border border-app-border text-gray-500 hover:text-gray-200 hover:bg-app-elevated
                     transition-colors duration-150"
        >
          <MdRefresh className={`text-sm ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Delivered",  count: delivered, border: "border-l-emerald-500", Icon: MdCheckCircle },
          { label: "In Transit", count: inTransit, border: "border-l-primary-500", Icon: MdTrendingUp },
          { label: "Pending",    count: pending,   border: "border-l-amber-500",   Icon: MdSchedule },
        ].map(({ label, count, border, Icon }) => (
          <div key={label} className={`card p-4 border-l-2 ${border}`}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500">{label}</p>
              <Icon className="text-gray-700 text-sm" />
            </div>
            <p className="text-2xl font-semibold text-gray-100">{count}</p>
          </div>
        ))}
      </div>

      {/* Shipment list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 space-y-2">
              <div className="skeleton h-4 w-1/3 rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : shipments.length === 0 ? (
        <div className="card">
          <div className="empty-state py-16">
            <div className="empty-state-icon"><MdLocalShipping /></div>
            <h3>No shipments assigned</h3>
            <p>Your administrator will assign shipments to you when ready</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {shipments.map((s) => {
            const statusKey = s.status?.toUpperCase();
            const dotClass  = STATUS_DOT[statusKey] ?? "bg-gray-500";
            const badgeCls  = STATUS_CLASSES[statusKey] ?? STATUS_CLASSES.PENDING;
            const isTerminal = s.status === "DELIVERED" || s.status === "CANCELLED";

            return (
              <div key={s.id} className="card p-4 hover:bg-app-elevated transition-colors duration-150">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Left info */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    {/* ID + Status row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="tracking-pill">{s.trackingId}</span>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium border px-2 py-0.5 rounded ${badgeCls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                        {s.status?.replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <MdLocationOn className="text-gray-700 flex-shrink-0" />
                      <span className="text-gray-500">{s.source}</span>
                      <span className="text-gray-700">→</span>
                      <span className="text-gray-300">{s.destination}</span>
                    </div>

                    {/* People & vehicle */}
                    <div className="flex items-center gap-4 text-[11px] text-gray-600">
                      <span className="flex items-center gap-1">
                        <MdPerson className="text-gray-700" />
                        {s.senderName} → {s.receiverName}
                      </span>
                      {s.vehicleAssigned && (
                        <span className="flex items-center gap-1 text-gray-500">
                          <MdDirectionsCar className="text-gray-700" />
                          {s.vehicleAssigned}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status update actions */}
                  {!isTerminal ? (
                    <div className="flex-shrink-0">
                      <p className="text-[10px] text-gray-700 mb-1.5 uppercase tracking-wider">Update</p>
                      <div className="flex flex-wrap gap-1">
                        {STATUS_OPTIONS.filter((opt) => opt !== s.status).map((opt) => (
                          <button
                            key={opt}
                            disabled={updating === s.trackingId}
                            onClick={() => updateStatus(s.trackingId, opt)}
                            className={`text-[11px] font-medium px-2 py-1 rounded border transition-colors duration-150
                              ${opt === "DELIVERED"
                                ? "text-emerald-400 bg-emerald-400/8 border-emerald-400/20 hover:bg-emerald-400/15"
                                : opt === "CANCELLED"
                                ? "text-red-400 bg-red-400/8 border-red-400/20 hover:bg-red-400/15"
                                : "text-primary-400 bg-primary-400/8 border-primary-400/20 hover:bg-primary-400/15"
                              } disabled:opacity-40`}
                          >
                            {updating === s.trackingId ? "…" : opt.replace(/_/g, " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-gray-700">
                      {s.status === "DELIVERED"
                        ? <><MdCheckCircle className="text-emerald-700" /> Completed</>
                        : <><MdCancel className="text-red-700" /> Cancelled</>
                      }
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}
