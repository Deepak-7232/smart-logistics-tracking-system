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
  const { drivers, fetchDrivers }                                        = useDriverStore();
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

  /* ── Columns ── */
  const columns = useMemo(() => [
    {
      id: "vehicle",
      header: "Vehicle",
      accessorKey: "vehicleNumber",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-app-elevated border border-app-border
                          flex items-center justify-center flex-shrink-0">
            <MdDirectionsCar className="text-gray-600 text-sm" />
          </div>
          <div>
            <p className="font-mono text-sm font-semibold text-gray-200">{row.original.vehicleNumber}</p>
            <p className="text-[11px] text-gray-600">{row.original.vehicleType}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "capacity", header: "Capacity", cell: ({ getValue }) => <span className="text-xs text-gray-400">{getValue() || "—"}</span> },
    {
      accessorKey: "driverAssigned",
      header: "Driver",
      cell: ({ getValue }) => getValue()
        ? <span className="text-xs text-gray-300">{getValue()}</span>
        : <span className="text-gray-700 text-xs italic">Unassigned</span>,
    },
    {
      accessorKey: "currentLocation",
      header: "Location",
      cell: ({ getValue }) => (
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <MdLocationOn className="text-gray-700 flex-shrink-0" /> {getValue() ?? "—"}
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
            if (window.confirm(`Delete vehicle ${row.original.vehicleNumber}?`)) {
              deleteVehicle(row.original.id)
                .then(() => toast.success("Vehicle deleted"))
                .catch(() => toast.error("Failed to delete vehicle"));
            }
          }}
          className="p-1.5 text-gray-700 hover:text-red-400 hover:bg-red-500/8 rounded
                     transition-colors duration-150"
          title="Delete Vehicle"
        >
          <MdDelete className="text-base" />
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
        <div className="page-header mb-0">
          <h1>Vehicles</h1>
          <p>{vehicles.length} registered vehicles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchVehicles}>
            <MdRefresh className="text-sm" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <MdAdd className="text-sm" /> Add Vehicle
          </Button>
        </div>
      </div>

      {/* Fleet stats — flat, 3 columns */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {loading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          <>
            <div className="card p-4 border-l-2 border-l-emerald-500">
              <p className="text-xs text-gray-500 mb-1">Available</p>
              <p className="text-2xl font-semibold text-gray-100">{available}</p>
            </div>
            <div className="card p-4 border-l-2 border-l-amber-500">
              <p className="text-xs text-gray-500 mb-1">In Use</p>
              <p className="text-2xl font-semibold text-gray-100">{inUse}</p>
            </div>
            <div className="card p-4 border-l-2 border-l-red-500">
              <p className="text-xs text-gray-500 mb-1">Maintenance</p>
              <p className="text-2xl font-semibold text-gray-100">{maintenance}</p>
            </div>
          </>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <DataTable
          columns={columns}
          data={vehicles}
          loading={loading}
          emptyMessage="No vehicles registered yet."
        />
      </div>

      {/* Add Vehicle Modal */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Vehicle" size="lg" disableClose={isSubmitting}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Vehicle Number *" placeholder="MH-12-AB-1234" error={errors.vehicleNumber?.message} {...register("vehicleNumber")} />
            <div>
              <label className="form-label">Vehicle Type *</label>
              <select className={`form-input ${errors.vehicleType ? "border-red-500/50" : ""}`} {...register("vehicleType")}>
                {VEHICLE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              {errors.vehicleType && <p className="mt-1 text-[11px] text-red-400">{errors.vehicleType.message}</p>}
            </div>
            <Input label="Capacity" placeholder="5 Ton" error={errors.capacity?.message} {...register("capacity")} />
            <div>
              <label className="form-label">Status</label>
              <select className="form-input" {...register("status")}>
                {VEHICLE_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <Input label="Current Location" placeholder="Mumbai Depot" error={errors.currentLocation?.message} {...register("currentLocation")} />
            <div>
              <label className="form-label">Assign Driver</label>
              <select className="form-input" {...register("driverAssigned")}>
                <option value="">— None —</option>
                {drivers.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" type="submit" loading={isSubmitting}>Add Vehicle</Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
