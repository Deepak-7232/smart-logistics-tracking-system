import { useState } from "react";
import { toast } from "react-toastify";
import {
  MdSearch, MdLocalShipping, MdPeople, MdDirectionsCar,
  MdLocationOn, MdArrowForward, MdCheckCircle, MdContentCopy,
  MdWarning
} from "react-icons/md";
import API from "../api/axios";
import Badge from "../components/Badge";

const STEPS = ["PENDING", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"];

function TrackingTimeline({ status, updatedAt }) {
  const isCancelled = status?.toUpperCase() === "CANCELLED";
  const current = isCancelled ? -1 : STEPS.indexOf(status?.toUpperCase());
  
  // Fake timeline dates based on 'updatedAt' or now
  const baseTime = updatedAt ? new Date(updatedAt).getTime() : Date.now();
  
  return (
    <div className="relative flex items-center justify-between mt-8 mb-4 px-2">
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-700/60 z-0 rounded-full" />
      
      {/* Animated progress line */}
      {!isCancelled && current > 0 && (
        <div 
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-violet-500 z-0 transition-all duration-1000 ease-in-out rounded-full" 
          style={{ width: `${(current / (STEPS.length - 1)) * 100}%` }} 
        />
      )}

      {STEPS.map((step, i) => {
        const done    = !isCancelled && i <= current;
        const active  = !isCancelled && i === current;
        const past    = !isCancelled && i < current;
        
        // Mock dates
        const stepTime = new Date(baseTime - ((STEPS.length - 1 - i) * 86400000));
        
        return (
          <div key={step} className={`flex flex-col items-center z-10 w-20 transition-all duration-700 ${isCancelled ? 'opacity-40 grayscale' : 'opacity-100'}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm transition-all duration-500
                ${past   ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" :
                  active ? "bg-primary-600 border-primary-400 text-white ring-4 ring-primary-500/20 shadow-[0_0_15px_rgba(99,102,241,0.4)]" :
                           "bg-slate-800 border-slate-700 text-slate-500"}`}
            >
              {past ? <MdCheckCircle className="text-base" /> : <span className="text-xs font-bold">{i + 1}</span>}
            </div>
            <span className={`text-[10px] mt-2.5 font-bold text-center leading-tight tracking-wide
              ${active ? "text-primary-400" : past ? "text-emerald-400" : "text-slate-500"}`}>
              {step.replace(/_/g, " ")}
            </span>
            {done && (
               <span className="text-[9px] text-slate-400 mt-1 font-medium bg-slate-900/50 border border-slate-700/50 px-1.5 py-0.5 rounded">
                 {stepTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
               </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TrackShipment() {
  const [trackingId, setTrackingId] = useState("");
  const [shipment,   setShipment]   = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [notFound,   setNotFound]   = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) { toast.error("Enter a tracking ID"); return; }
    setLoading(true);
    setShipment(null);
    setNotFound(false);
    try {
      const res = await API.get(`/shipments/${trackingId.trim()}`);
      if (res.data) { setShipment(res.data); }
      else { setNotFound(true); }
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true);
      else toast.error("Failed to reach server");
    } finally { setLoading(false); }
  };

  const copyTrackingId = () => {
    navigator.clipboard.writeText(shipment.trackingId);
    toast.success("Tracking ID copied!", { autoClose: 1500 });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600
                          items-center justify-center shadow-xl shadow-primary-900/40 mb-3">
            <MdLocalShipping className="text-2xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Track Your Shipment</h1>
          <p className="text-sm text-slate-400 mt-1">Enter your tracking ID to get real-time status</p>
        </div>

        {/* Search card */}
        <div className="glass-card p-6 bg-slate-900/80 border border-slate-700/60 mb-6">
          <form onSubmit={handleTrack} className="flex gap-3">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter Tracking ID (e.g. TRK-2025-001)"
                className="form-input pl-10"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><MdSearch /> Track</>
              }
            </button>
          </form>
        </div>

        {/* Not found */}
        {notFound && (
          <div className="glass-card p-8 text-center border border-red-500/20 animate-fade-in">
            <MdLocalShipping className="text-4xl text-red-400/50 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">Shipment not found</p>
            <p className="text-sm text-slate-500 mt-1">
              No shipment found with tracking ID <span className="text-red-400 font-mono">{trackingId}</span>
            </p>
          </div>
        )}

        {/* Result card */}
        {shipment && (
          <div className="glass-card overflow-hidden border border-primary-500/20 shadow-2xl shadow-primary-900/10 animate-fade-in">
            {/* Header */}
            <div className="bg-slate-800/40 p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold bg-slate-900 border border-primary-500/30 text-primary-400 px-3 py-1 rounded-lg">
                    {shipment.trackingId}
                  </span>
                  <button onClick={copyTrackingId} className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-md transition-colors" title="Copy ID">
                    <MdContentCopy />
                  </button>
                </div>
                <Badge status={shipment.status} />
              </div>

              {shipment.status === "CANCELLED" && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400">
                  <MdWarning className="text-lg" />
                  <span className="text-sm font-medium">This shipment has been cancelled and will not be delivered.</span>
                </div>
              )}

              {["IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(shipment.status) && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-400/80 font-medium uppercase tracking-wide">Estimated Delivery</p>
                    <p className="text-sm text-emerald-400 font-bold mt-0.5">By Tomorrow, 9:00 PM</p>
                  </div>
                  <MdLocalShipping className="text-3xl text-emerald-500/40" />
                </div>
              )}
            </div>

            <div className="p-6">
              {/* Timeline */}
              <div className="mb-8">
                <TrackingTimeline status={shipment.status} />
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Sender",      value: shipment.senderName,   icon: MdPeople },
                  { label: "Receiver",    value: shipment.receiverName, icon: MdPeople },
                  { label: "From",        value: shipment.source,       icon: MdLocationOn },
                  { label: "To",          value: shipment.destination,  icon: MdArrowForward },
                  { label: "Driver",      value: shipment.driverAssigned   ?? "Not assigned", icon: MdPeople },
                  { label: "Vehicle",     value: shipment.vehicleAssigned  ?? "Not assigned", icon: MdDirectionsCar },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                      <Icon className="text-sm text-slate-400" /> {label}
                    </p>
                    <p className="text-sm font-medium text-slate-200">{value ?? "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back to login link */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Admin?{" "}
          <a href="/" className="text-primary-400 hover:text-primary-300 transition-colors">
            Sign in to manage shipments →
          </a>
        </p>
      </div>
    </div>
  );
}
