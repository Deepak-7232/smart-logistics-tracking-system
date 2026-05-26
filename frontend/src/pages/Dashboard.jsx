import { useEffect } from "react";
import {
  MdLocalShipping, MdPeople, MdDirectionsCar,
  MdCheckCircle, MdTrendingUp, MdSchedule,
} from "react-icons/md";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import { SkeletonCard, SkeletonTable } from "../components/ui/Skeleton";

import useShipmentStore from "../store/useShipmentStore";
import useDriverStore   from "../store/useDriverStore";
import useVehicleStore  from "../store/useVehicleStore";
import { useAuth }      from "../context/AuthContext";
import { ROLES }        from "../constants/roles";

/* ── Clean minimal tooltip ── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-app-surface border border-app-border rounded-lg px-3 py-2 text-xs shadow-lg">
      {label && <p className="text-gray-500 mb-1">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="font-medium" style={{ color: p.color ?? p.fill }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { shipments, loading: sLoading, fetchShipments, fetchMyShipments } = useShipmentStore();
  const { drivers,   loading: dLoading, fetchDrivers }   = useDriverStore();
  const { vehicles,  loading: vLoading, fetchVehicles }  = useVehicleStore();

  const { isAdmin, user } = useAuth();
  const admin  = isAdmin();

  useEffect(() => {
    if (admin) {
      fetchShipments();
      fetchDrivers();
      fetchVehicles();
    } else {
      if (user?.email) fetchMyShipments(user.email);
    }
  }, [admin, user]);

  const loading = sLoading || (admin && (dLoading || vLoading));

  /* ── Computed stats ── */
  const delivered      = shipments.filter(s => s.status?.toUpperCase() === "DELIVERED").length;
  const inTransit      = shipments.filter(s => s.status?.toUpperCase() === "IN_TRANSIT").length;
  const pending        = shipments.filter(s => s.status?.toUpperCase() === "PENDING").length;
  const outForDelivery = shipments.filter(s => s.status?.toUpperCase() === "OUT_FOR_DELIVERY").length;

  const adminStats = [
    { title: "Total Shipments", value: shipments.length, icon: MdLocalShipping, color: "indigo",  trend: 12, trendLabel: "vs last month" },
    { title: "Active Drivers",  value: drivers.length,   icon: MdPeople,        color: "violet",  trend: 5,  trendLabel: "added this week" },
    { title: "Fleet Vehicles",  value: vehicles.length,  icon: MdDirectionsCar, color: "cyan",    trend: 2,  trendLabel: "new vehicles" },
    { title: "Delivered",       value: delivered,         icon: MdCheckCircle,   color: "emerald", trend: 18, trendLabel: "completion rate" },
    { title: "In Transit",      value: inTransit,         icon: MdTrendingUp,    color: "amber",   trend: -3, trendLabel: "vs yesterday" },
    { title: "Pending",         value: pending,           icon: MdSchedule,      color: "rose",    trend: 0,  trendLabel: "awaiting pickup" },
  ];

  const userStats = [
    { title: "Total Shipments", value: shipments.length, icon: MdLocalShipping, color: "indigo",  trend: 12, trendLabel: "vs last month" },
    { title: "Delivered",       value: delivered,         icon: MdCheckCircle,   color: "emerald", trend: 18, trendLabel: "completion rate" },
    { title: "In Transit",      value: inTransit,         icon: MdTrendingUp,    color: "amber",   trend: -3, trendLabel: "vs yesterday" },
    { title: "Pending",         value: pending,           icon: MdSchedule,      color: "rose",    trend: 0,  trendLabel: "awaiting pickup" },
  ];

  const stats = admin ? adminStats : userStats;

  /* ── Chart data — semantic muted colors ── */
  const PIE_DATA = [
    { name: "Delivered",        value: delivered,      fill: "#10b981" },
    { name: "In Transit",       value: inTransit,      fill: "#6366f1" },
    { name: "Pending",          value: pending,        fill: "#f59e0b" },
    { name: "Out for Delivery", value: outForDelivery, fill: "#8b5cf6" },
  ].filter(d => d.value > 0);

  const BAR_DATA = [
    { name: "Pending",    count: pending,        fill: "#f59e0b" },
    { name: "In Transit", count: inTransit,      fill: "#6366f1" },
    { name: "Out",        count: outForDelivery, fill: "#8b5cf6" },
    { name: "Delivered",  count: delivered,      fill: "#10b981" },
  ];

  // Fleet summary for admin
  const available   = vehicles.filter(v => v.status?.toUpperCase() === "AVAILABLE").length;
  const inUse       = vehicles.filter(v => v.status?.toUpperCase() === "IN_USE").length;
  const maintenance = vehicles.filter(v => v.status?.toUpperCase() === "MAINTENANCE").length;

  return (
    <MainLayout>
      {/* ── Page header ── */}
      <div className="page-header">
        <h1>Overview</h1>
        <p>
          {admin
            ? `${shipments.length} shipments · ${drivers.length} drivers · ${vehicles.length} vehicles`
            : `${shipments.length} assigned shipment${shipments.length !== 1 ? "s" : ""}`
          }
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className={`grid gap-3 mb-6 ${admin ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`}>
        {loading
          ? Array.from({ length: stats.length }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((s) => <StatCard key={s.title} {...s} />)
        }
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Donut — Shipment Status */}
        <div className="card p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Status Distribution
          </p>
          {loading || PIE_DATA.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-700 text-xs">
              {loading ? "Loading…" : "No data yet"}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-[11px] text-gray-500">{value}</span>}
                  iconSize={6}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar — Shipment Breakdown */}
        <div className="card p-5 col-span-1 lg:col-span-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Shipment Breakdown
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BAR_DATA} barCategoryGap="40%" barGap={4}>
              <CartesianGrid strokeDasharray="2 2" stroke="#1F2937" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#4B5563", fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: "#4B5563", fontSize: 11 }}
                axisLine={false} tickLine={false}
                allowDecimals={false}
                width={28}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="count" name="Shipments" radius={[3, 3, 0, 0]}>
                {BAR_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Fleet summary — Admin only */}
        {admin && (
          <div className="card p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Fleet Status
            </p>
            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="skeleton h-10 rounded" />)}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="empty-state py-8">
                <div className="empty-state-icon"><MdDirectionsCar /></div>
                <h3>No vehicles</h3>
                <p>Add vehicles from the fleet page</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: "Available",   count: available,   color: "text-emerald-400", bar: "bg-emerald-500" },
                  { label: "In Use",      count: inUse,       color: "text-amber-400",   bar: "bg-amber-500" },
                  { label: "Maintenance", count: maintenance, color: "text-red-400",      bar: "bg-red-500" },
                ].map(({ label, count, color, bar }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{label}</span>
                      <span className={`text-xs font-semibold ${color}`}>{count}</span>
                    </div>
                    <div className="h-1.5 bg-app-elevated rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bar} rounded-full`}
                        style={{ width: vehicles.length > 0 ? `${(count / vehicles.length) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-gray-700 mt-2">{vehicles.length} total vehicles</p>
              </div>
            )}
          </div>
        )}

        {/* Recent Shipments */}
        <div className={`card overflow-hidden ${admin ? "col-span-1 lg:col-span-2" : "col-span-1 lg:col-span-3"}`}>
          <div className="px-5 py-4 border-b border-app-border">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Shipments</p>
          </div>
          {sLoading ? (
            <SkeletonTable rows={5} cols={4} />
          ) : shipments.length === 0 ? (
            <div className="empty-state py-12">
              <div className="empty-state-icon"><MdLocalShipping /></div>
              <h3>No shipments yet</h3>
              <p>Shipments will appear here once created</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Sender</th>
                    <th>Route</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.slice(0, 8).map((s) => (
                    <tr key={s.id}>
                      <td>
                        <span className="tracking-pill">{s.trackingId}</span>
                      </td>
                      <td className="text-gray-300">{s.senderName}</td>
                      <td>
                        <span className="text-gray-500">{s.source}</span>
                        <span className="text-gray-700 mx-1.5">→</span>
                        <span className="text-gray-300">{s.destination}</span>
                      </td>
                      <td><Badge status={s.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
