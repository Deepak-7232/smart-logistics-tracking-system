import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { MdAdd, MdRefresh, MdDirectionsCar, MdLocationOn, MdDelete } from "react-icons/md";

import MainLayout from "../layouts/MainLayout";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { SkeletonCard } from "../components/ui/Skeleton";

import useVehicleStore from "../store/useVehicleStore";
import useDriverStore  from "../store/useDriverStore";
import { vehicleSchema, VEHICLE_TYPES, VEHICLE_STATUSES } from "../schemas/vehicleSchema";

export default function Vehicles() {
  const { vehicles, loading, fetchVehicles, addVehicle, deleteVehicle } = useVehicleStore();
  const { drivers, fetchDrivers }                        = useDriverStore();
  const [open, setOpen] = useState(false);

  useEffect(() => { fetchVehicles(); fetchDrivers(); }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { status: "AVAILABLE", vehicleType: "Truck" },
  });

  const onSubmit = async (data) => {
    try {
      await addVehicle(data);
      toast.success("Vehicle added!");
      setOpen(false);
      reset();
    } catch {
      toast.error("Failed to add vehicle");
    }
  };

  /* ---- TanStack columns ---- */
  const columns = useMemo(() => [
    {
      id: "vehicle",
      header: "Vehicle",
      accessorKey: "vehicleNumber",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-lg flex-shrink-0">
            <MdDirectionsCar />
          </div>
          <div>
            <p className="font-mono font-semibold text-slate-200 text-sm">{row.original.vehicleNumber}</p>
            <p className="text-xs text-slate-500">{row.original.vehicleType}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "capacity",       header: "Capacity" },
    {
      accessorKey: "driverAssigned",
      header: "Driver",
      cell: ({ getValue }) => getValue()
        ? <span className="text-violet-400">{getValue()}</span>
        : <span className="text-slate-600 italic text-xs">Unassigned</span>,
    },
    {
      accessorKey: "currentLocation",
      header: "Location",
      cell: ({ getValue }) => (
        <span className="flex items-center gap-1 text-slate-300">
          <MdLocationOn className="text-slate-500 flex-shrink-0" /> {getValue() ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <Badge status={getValue()} />,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete vehicle ${row.original.vehicleNumber}?`)) {
              deleteVehicle(row.original.id)
                .then(() => toast.success("Vehicle deleted"))
                .catch(() => toast.error("Failed to delete vehicle"));
            }
          }}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded-lg transition-all"
          title="Delete Vehicle"
        >
          <MdDelete className="text-lg" />
        </button>
      ),
    },
  ], []);

  const available   = vehicles.filter((v) => v.status?.toUpperCase() === "AVAILABLE").length;
  const inUse       = vehicles.filter((v) => v.status?.toUpperCase() === "IN_USE").length;
  const maintenance = vehicles.filter((v) => v.status?.toUpperCase() === "MAINTENANCE").length;

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Vehicles</h1>
          <p className="text-xs text-slate-500 mt-0.5">{vehicles.length} registered vehicles</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={fetchVehicles}><MdRefresh /> Refresh</Button>
          <Button size="sm" onClick={() => setOpen(true)}><MdAdd /> Add Vehicle</Button>
        </div>
      </div>

      {/* Fleet stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {loading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          [
            { label: "Available",   value: available,   color: "text-cyan-400",  bg: "bg-cyan-500/15" },
            { label: "In Use",      value: inUse,       color: "text-amber-400", bg: "bg-amber-500/15" },
            { label: "Maintenance", value: maintenance, color: "text-rose-400",  bg: "bg-rose-500/15" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="glass-card p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <MdDirectionsCar className={`${color} text-lg`} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <DataTable columns={columns} data={vehicles} loading={loading} emptyMessage="No vehicles registered yet." />
      </div>

      {/* Modal */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add New Vehicle" size="lg" disableClose={isSubmitting}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Vehicle Number *" placeholder="MH-12-AB-1234" error={errors.vehicleNumber?.message} {...register("vehicleNumber")} />
            <div>
              <label className="form-label">Vehicle Type *</label>
              <select className={`form-input ${errors.vehicleType ? "border-red-500/60" : ""}`} {...register("vehicleType")}>
                {VEHICLE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              {errors.vehicleType && <p className="mt-1 text-xs text-red-400">{errors.vehicleType.message}</p>}
            </div>
            <Input label="Capacity"         placeholder="5 Ton"         error={errors.capacity?.message}      {...register("capacity")} />
            <div>
              <label className="form-label">Status</label>
              <select className="form-input" {...register("status")}>
                {VEHICLE_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <Input label="Current Location" placeholder="Mumbai Depot"  error={errors.currentLocation?.message} {...register("currentLocation")} />
            <div>
              <label className="form-label">Assign Driver</label>
              <select className="form-input" {...register("driverAssigned")}>
                <option value="">— None —</option>
                {drivers.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" type="submit" loading={isSubmitting}>Add Vehicle</Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
