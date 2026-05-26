import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { MdAdd, MdRefresh, MdPeople, MdPhone, MdDelete, MdCheckCircle, MdCancel } from "react-icons/md";

import MainLayout from "../layouts/MainLayout";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { SkeletonCard } from "../components/ui/Skeleton";

import useDriverStore  from "../store/useDriverStore";
import useVehicleStore from "../store/useVehicleStore";
import { driverSchema } from "../schemas/driverSchema";

export default function Drivers() {
  const { drivers, loading, fetchDrivers, addDriver, deleteDriver } = useDriverStore();
  const { vehicles, fetchVehicles }                                  = useVehicleStore();
  const [open, setOpen] = useState(false);

  useEffect(() => { fetchDrivers(); fetchVehicles(); }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(driverSchema) });

  const onSubmit = async (data) => {
    try {
      await addDriver(data);
      toast.success("Driver added successfully!");
      setOpen(false);
      reset();
    } catch {
      toast.error("Failed to add driver");
    }
  };

  /* ── Columns ── */
  const columns = useMemo(() => [
    {
      id: "driver",
      header: "Driver",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-app-elevated border border-app-border
                          flex items-center justify-center text-xs font-semibold text-gray-400 flex-shrink-0">
            {row.original.name?.[0]?.toUpperCase() ?? "D"}
          </div>
          <span className="text-sm text-gray-200 font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ getValue }) => (
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <MdPhone className="text-gray-700 flex-shrink-0" /> {getValue()}
        </span>
      ),
    },
    {
      accessorKey: "licenseNumber",
      header: "License No.",
      cell: ({ getValue }) => (
        <span className="font-mono text-[11px] bg-app-elevated text-amber-400 px-2 py-0.5 rounded border border-app-border">
          {getValue() || "—"}
        </span>
      ),
    },
    {
      accessorKey: "available",
      header: "Status",
      cell: ({ getValue }) => getValue()
        ? <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-400/8 border border-emerald-400/20 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Available
          </span>
        : <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-400 bg-red-400/8 border border-red-400/20 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Unavailable
          </span>,
    },
    {
      accessorKey: "vehicleAssigned",
      header: "Vehicle",
      cell: ({ getValue }) => getValue()
        ? <span className="text-xs text-gray-300 font-mono">{getValue()}</span>
        : <span className="text-gray-700 text-xs italic">Not assigned</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <button
          onClick={() => {
            if (window.confirm(`Delete driver ${row.original.name}?`)) {
              deleteDriver(row.original.id)
                .then(() => toast.success("Driver deleted"))
                .catch(() => toast.error("Failed to delete driver"));
            }
          }}
          className="p-1.5 text-gray-700 hover:text-red-400 hover:bg-red-500/8 rounded
                     transition-colors duration-150"
          title="Delete Driver"
        >
          <MdDelete className="text-base" />
        </button>
      ),
    },
  ], []);

  const assigned   = drivers.filter((d) => d.vehicleAssigned).length;
  const available  = drivers.filter((d) => d.available).length;

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1>Drivers</h1>
          <p>{drivers.length} registered drivers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchDrivers}>
            <MdRefresh className="text-sm" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <MdAdd className="text-sm" /> Add Driver
          </Button>
        </div>
      </div>

      {/* Quick stats — flat cards, no colored numbers */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {loading ? (
          <><SkeletonCard /><SkeletonCard /></>
        ) : (
          <>
            <div className="card p-4 border-l-2 border-l-primary-500">
              <p className="text-xs text-gray-500 mb-1">Total Drivers</p>
              <p className="text-2xl font-semibold text-gray-100">{drivers.length}</p>
            </div>
            <div className="card p-4 border-l-2 border-l-emerald-500">
              <p className="text-xs text-gray-500 mb-1">Available</p>
              <p className="text-2xl font-semibold text-gray-100">{available}</p>
            </div>
          </>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <DataTable
          columns={columns}
          data={drivers}
          loading={loading}
          emptyMessage="No drivers registered yet."
        />
      </div>

      {/* Add Driver Modal */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Driver" disableClose={isSubmitting}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          <Input label="Full Name *"     placeholder="Rajesh Kumar"       error={errors.name?.message}          {...register("name")} />
          <Input label="Phone Number *"  placeholder="+91 99999 00000"    error={errors.phone?.message}         {...register("phone")} />
          <Input label="License Number"  placeholder="DL-0120110012345"   error={errors.licenseNumber?.message} {...register("licenseNumber")} />
          <div>
            <label className="form-label">Assign Vehicle</label>
            <select className="form-input" {...register("vehicleAssigned")}>
              <option value="">— None —</option>
              {vehicles.map((v) => <option key={v.id} value={v.vehicleNumber}>{v.vehicleNumber} · {v.vehicleType}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" type="submit" loading={isSubmitting}>Add Driver</Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
