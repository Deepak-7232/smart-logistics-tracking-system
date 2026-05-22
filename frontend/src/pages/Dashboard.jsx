import { useEffect } from "react";
import {
  MdLocalShipping, MdPeople, MdDirectionsCar,
  MdCheckCircle, MdTrendingUp, MdSchedule,
} from "react-icons/md";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar,
} from "recharts";

import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import { SkeletonCard, SkeletonTable } from "../components/ui/Skeleton";

import useShipmentStore from "../store/useShipmentStore";
import useDriverStore   from "../store/useDriverStore";
import useVehicleStore  from "../store/useVehicleStore";

/* ── Custom tooltip ── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-slate-400 mb-1 font-medium">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color ?? p.fill }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { shipments, loading: sLoading, fetchShipments } = useShipmentStore();
  const { drivers,   loading: dLoading, fetchDrivers }   = useDriverStore();
  const { vehicles,  loading: vLoading, fetchVehicles }  = useVehicleStore();

  useEffect(() => {
    fetchShipments();
    fetchDrivers();
    fetchVehicles();
  }, []);

  const loading = sLoading || dLoading || vLoading;

  /* ── Computed stats ── */
  const delivered       = shipments.filter(s => s.status?.toUpperCase() === "DELIVERED").length;
  const inTransit       = shipments.filter(s => s.status?.toUpperCase() === "IN_TRANSIT").length;
  const pending         = shipments.filter(s => s.status?.toUpperCase() === "PENDING").length;
  const outForDelivery  = shipments.filter(s => s.status?.toUpperCase() === "OUT_FOR_DELIVERY").length;

  const stats = [
    { title: "Total Shipments", value: shipments.length, icon: MdLocalShipping, color: "indigo",  trend: 12, trendLabel: "vs last month" },
    { title: "Active Drivers",  value: drivers.length,   icon: MdPeople,        color: "violet",  trend: 5,  trendLabel: "added this week" },
    { title: "Fleet Vehicles",  value: vehicles.length,  icon: MdDirectionsCar, color: "cyan",    trend: 2,  trendLabel: "new vehicles" },
    { title: "Delivered",       value: delivered,         icon: MdCheckCircle,   color: "emerald", trend: 18, trendLabel: "completion rate" },
    { title: "In Transit",      value: inTransit,         icon: MdTrendingUp,    color: "amber",   trend: -3, trendLabel: "vs yesterday" },
    { title: "Pending",         value: pending,           icon: MdSchedule,      color: "rose",    trend: 0,  trendLabel: "awaiting pickup" },
  ];

  /* ── Chart data ── */
  const PIE_DATA = [
    { name: "Delivered",       value: delivered,      fill: "#10b981" },
    { name: "In Transit",      value: inTransit,      fill: "#6366f1" },
    { name: "Pending",         value: pending,        fill: "#f59e0b" },
    { name: "Out for Delivery",value: outForDelivery, fill: "#8b5cf6" },
  ].filter(d => d.value > 0);

  const BAR_DATA = [
    { name: "Pending",    count: pending },
    { name: "In Transit", count: inTransit },
    { name: "Out",        count: outForDelivery },
    { name: "Delivered",  count: delivered },
  ];

  const available   = vehicles.filter(v => v.status?.toUpperCase() === "AVAILABLE").length;
  const inUse       = vehicles.filter(v => v.status?.toUpperCase() === "IN_USE").length;
  const maintenance = vehicles.filter(v => v.status?.toUpperCase() === "MAINTENANCE").length;
  const RADIAL_DATA = [
    { name: "Available",   value: available,   fill: "#06b6d4" },
    { name: "In Use",      value: inUse,       fill: "#f59e0b" },
    { name: "Maintenance", value: maintenance, fill: "#f43f5e" },
  ];

  return (
    <MainLayout>
      <div className="page-header flex items-center gap-3">
        <div className="w-2 h-8 bg-gradient-to-b from-primary-500 to-violet-600 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time logistics dashboard</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((s) => <StatCard key={s.title} {...s} />)
        }
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Shipment Status Distribution — Donut */}
        <div className="glass-card p-5 col-span-1">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Shipment Status</h2>
          {loading || PIE_DATA.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-600 text-xs">
              {loading ? "Loading…" : "No data yet"}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-[11px] text-slate-400">{value}</span>}
                  iconSize={8}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Shipment Breakdown — Bar */}
        <div className="glass-card p-5 col-span-1 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Shipment Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BAR_DATA} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
              <Bar dataKey="count" name="Shipments" radius={[6, 6, 0, 0]}>
                {BAR_DATA.map((_, i) => (
                  <Cell key={i} fill={["#f59e0b","#6366f1","#8b5cf6","#10b981"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fleet Utilization — Radial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Fleet Utilization</h2>
          {loading || vehicles.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-600 text-xs">
              {loading ? "Loading…" : "No vehicles yet"}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <RadialBarChart
                innerRadius="30%"
                outerRadius="90%"
                data={RADIAL_DATA}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar minAngle={15} dataKey="value" cornerRadius={6} />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-[11px] text-slate-400">{value}</span>}
                  iconSize={8}
                  iconType="circle"
                />
              </RadialBarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Shipments Table */}
        <div className="glass-card p-5 col-span-1 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Recent Shipments</h2>
          {sLoading ? (
            <SkeletonTable rows={5} cols={4} />
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tracking ID</th><th>Sender</th><th>Route</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.slice(0, 8).map((s) => (
                    <tr key={s.id}>
                      <td>
                        <span className="font-mono text-xs bg-slate-800 text-primary-400 px-2 py-0.5 rounded">
                          {s.trackingId}
                        </span>
                      </td>
                      <td>{s.senderName}</td>
                      <td>
                        <span className="text-slate-400">{s.source}</span>
                        <span className="text-slate-700 mx-1">→</span>
                        {s.destination}
                      </td>
                      <td><Badge status={s.status} /></td>
                    </tr>
                  ))}
                  {shipments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-slate-600 italic text-sm">
                        No shipments yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
