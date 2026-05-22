import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { MdAdd, MdRefresh, MdPeople, MdPhone, MdBadge, MdDelete } from "react-icons/md";

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
  const { drivers, loading, fetchDrivers, addDriver, deleteDriver }  = useDriverStore();
  const { vehicles, fetchVehicles }                    = useVehicleStore();
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

  /* ---- TanStack columns ---- */
  const columns = useMemo(() => [
    {
      id: "driver",
      header: "Driver",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400
                          flex items-center justify-center text-sm font-bold flex-shrink-0">
            {row.original.name?.[0]?.toUpperCase() ?? "D"}
          </div>
          <span className="font-medium text-slate-200">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ getValue }) => (
        <span className="flex items-center gap-1.5 text-slate-300">
          <MdPhone className="text-slate-500" /> {getValue()}
        </span>
      ),
    },
    {
      accessorKey: "licenseNumber",
      header: "License No.",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded">
          {getValue() || "—"}
        </span>
      ),
    },
    {
      accessorKey: "vehicleAssigned",
      header: "Vehicle Assigned",
      cell: ({ getValue }) => getValue()
        ? <span className="text-cyan-400">{getValue()}</span>
        : <span className="text-slate-600 italic text-xs">Not assigned</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete driver ${row.original.name}?`)) {
              deleteDriver(row.original.id)
                .then(() => toast.success("Driver deleted"))
                .catch(() => toast.error("Failed to delete driver"));
            }
          }}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded-lg transition-all"
          title="Delete Driver"
        >
          <MdDelete className="text-lg" />
        </button>
      ),
    },
  ], []);

  const assigned = drivers.filter((d) => d.vehicleAssigned).length;

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Drivers</h1>
          <p className="text-xs text-slate-500 mt-0.5">{drivers.length} registered drivers</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={fetchDrivers}><MdRefresh /> Refresh</Button>
          <Button size="sm" onClick={() => setOpen(true)}><MdAdd /> Add Driver</Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {loading ? (
          <><SkeletonCard /><SkeletonCard /></>
        ) : (
          <>
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <MdPeople className="text-violet-400 text-xl" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Drivers</p>
                <p className="text-2xl font-bold text-violet-400">{drivers.length}</p>
              </div>
            </div>
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <MdPeople className="text-cyan-400 text-xl" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Assigned to Vehicle</p>
                <p className="text-2xl font-bold text-cyan-400">{assigned}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <DataTable columns={columns} data={drivers} loading={loading} emptyMessage="No drivers registered yet." />
      </div>

      {/* Modal */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add New Driver" disableClose={isSubmitting}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input label="Full Name *"     placeholder="e.g. Rajesh Kumar"   error={errors.name?.message}          {...register("name")} />
          <Input label="Phone Number *"  placeholder="+91 99999 00000"     error={errors.phone?.message}         {...register("phone")} />
          <Input label="License Number"  placeholder="DL-0120110012345"    error={errors.licenseNumber?.message} {...register("licenseNumber")} />
          <div>
            <label className="form-label">Assign Vehicle</label>
            <select className="form-input" {...register("vehicleAssigned")}>
              <option value="">— None —</option>
              {vehicles.map((v) => <option key={v.id} value={v.vehicleNumber}>{v.vehicleNumber} · {v.vehicleType}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" type="submit" loading={isSubmitting}>Add Driver</Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
