import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { MdAdd, MdRefresh, MdEdit, MdPeople, MdDirectionsCar } from "react-icons/md";

import MainLayout from "../layouts/MainLayout";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { SkeletonTable } from "../components/ui/Skeleton";

import useShipmentStore from "../store/useShipmentStore";
import useDriverStore   from "../store/useDriverStore";
import useVehicleStore  from "../store/useVehicleStore";
import { shipmentSchema } from "../schemas/shipmentSchema";

const STATUSES = ["PENDING", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function Shipments() {
  const { shipments, loading, fetchShipments, addShipment, updateShipment } = useShipmentStore();
  const { drivers,  loading: dLoading, fetchDrivers }   = useDriverStore();
  const { vehicles, loading: vLoading, fetchVehicles }  = useVehicleStore();

  const [createOpen,    setCreateOpen]    = useState(false);
  const [manageOpen,    setManageOpen]    = useState(false);
  const [selectedShip,  setSelectedShip]  = useState(null);
  const [managing,      setManaging]      = useState(false);
  const [manageStatusSelected, setManageStatusSelected] = useState("");

  useEffect(() => {
    fetchShipments();
    fetchDrivers();
    fetchVehicles();
  }, []);

  /* ---- Create form ---- */
  const {
    register: rCreate,
    handleSubmit: hsCreate,
    reset: resetCreate,
    formState: { errors: eCreate, isSubmitting: submittingCreate },
  } = useForm({ resolver: zodResolver(shipmentSchema), defaultValues: { status: "PENDING" } });

  const onCreateSubmit = async (data) => {
    try {
      await addShipment(data);
      toast.success("Shipment created!");
      setCreateOpen(false);
      resetCreate();
    } catch {
      toast.error("Failed to create shipment");
    }
  };

  /* ---- Manage modal ---- */
  const openManage = (ship) => { 
    setSelectedShip(ship); 
    setManageStatusSelected(ship.status);
    setManageOpen(true); 
  };

  const handleManage = async (e) => {
    e.preventDefault();
    if (!selectedShip) return;
    setManaging(true);
    const fd = new FormData(e.target);
    const status  = fd.get("status")  || "";
    const driver  = fd.get("driver")  || "";
    const vehicle = fd.get("vehicle") || "";
    try {
      await updateShipment(selectedShip.trackingId, {
        status:  status  !== selectedShip.status          ? status  : "",
        driver:  driver  !== (selectedShip.driverAssigned  ?? "") ? driver  : "",
        vehicle: vehicle !== (selectedShip.vehicleAssigned ?? "") ? vehicle : "",
      });
      toast.success(status === "CANCELLED" ? "Shipment has been cancelled" : "Shipment updated!");
      setManageOpen(false);
    } catch {
      toast.error("Failed to update shipment");
    } finally {
      setManaging(false);
    }
  };

  /* ---- TanStack column definitions ---- */
  const columns = useMemo(() => [
    {
      accessorKey: "trackingId",
      header: "Tracking ID",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs bg-slate-800 text-primary-400 px-2 py-0.5 rounded">
          {getValue()}
        </span>
      ),
    },
    { accessorKey: "senderName",   header: "Sender" },
    { accessorKey: "receiverName", header: "Receiver" },
    {
      id: "route",
      header: "Route",
      accessorFn: (row) => `${row.source} → ${row.destination}`,
      cell: ({ row }) => (
        <span className="text-sm">
          <span className="text-slate-400">{row.original.source}</span>
          <span className="text-slate-700 mx-1.5">→</span>
          {row.original.destination}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <Badge status={getValue()} />,
    },
    {
      accessorKey: "driverAssigned",
      header: "Driver",
      cell: ({ getValue }) => getValue()
        ? <span className="flex items-center gap-1 text-sm"><MdPeople className="text-violet-400" />{getValue()}</span>
        : <span className="text-slate-600 italic text-xs">Unassigned</span>,
    },
    {
      accessorKey: "vehicleAssigned",
      header: "Vehicle",
      cell: ({ getValue }) => getValue()
        ? <span className="flex items-center gap-1 text-sm"><MdDirectionsCar className="text-cyan-400" />{getValue()}</span>
        : <span className="text-slate-600 italic text-xs">Unassigned</span>,
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <button
          onClick={() => openManage(row.original)}
          className="flex items-center gap-1 text-xs bg-primary-600/20 hover:bg-primary-600/30
                     text-primary-400 border border-primary-500/30 px-2.5 py-1.5 rounded-lg transition-all"
        >
          <MdEdit /> Manage
        </button>
      ),
    },
  ], []);

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Shipments</h1>
          <p className="text-xs text-slate-500 mt-0.5">{shipments.length} total shipments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={fetchShipments}>
            <MdRefresh /> Refresh
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <MdAdd /> New Shipment
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <DataTable columns={columns} data={shipments} loading={loading} emptyMessage="No shipments found. Create your first!" />
      </div>

      {/* ── Create Modal ── */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create New Shipment" size="lg" disableClose={submittingCreate}>
        <form onSubmit={hsCreate(onCreateSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tracking ID *"   placeholder="TRK-2025-001" error={eCreate.trackingId?.message}   {...rCreate("trackingId")} />
            <div>
              <label className="form-label">Status</label>
              <select className="form-input" {...rCreate("status")}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {eCreate.status && <p className="mt-1 text-xs text-red-400">{eCreate.status.message}</p>}
            </div>
            <Input label="Sender Name *"   placeholder="John Doe"   error={eCreate.senderName?.message}   {...rCreate("senderName")} />
            <Input label="Receiver Name *" placeholder="Jane Smith" error={eCreate.receiverName?.message} {...rCreate("receiverName")} />
            <Input label="Source *"        placeholder="Mumbai"     error={eCreate.source?.message}       {...rCreate("source")} />
            <Input label="Destination *"   placeholder="Delhi"      error={eCreate.destination?.message}  {...rCreate("destination")} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button size="sm" type="submit" loading={submittingCreate}>Create Shipment</Button>
          </div>
        </form>
      </Modal>

      {/* ── Manage Modal ── */}
      <Modal isOpen={manageOpen} onClose={() => setManageOpen(false)} title={`Manage · ${selectedShip?.trackingId}`} disableClose={managing}>
        <form onSubmit={handleManage} className="space-y-4">
          <div>
            <label className="form-label">Update Status</label>
            <select 
              name="status" 
              className="form-input" 
              value={manageStatusSelected}
              onChange={(e) => setManageStatusSelected(e.target.value)}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {manageStatusSelected === "CANCELLED" && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2 text-red-400">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <div className="text-xs">
                <p className="font-bold mb-0.5">Warning</p>
                <p className="opacity-90">Cancelling a shipment is permanent. Are you sure you want to proceed?</p>
              </div>
            </div>
          )}

          <div>
            <label className="form-label">Assign Driver</label>
            <select name="driver" className="form-input" defaultValue={selectedShip?.driverAssigned ?? ""}>
              <option value="">— Keep current —</option>
              {drivers.map((d) => <option key={d.id} value={d.name}>{d.name} ({d.phone})</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Assign Vehicle</label>
            <select name="vehicle" className="form-input" defaultValue={selectedShip?.vehicleAssigned ?? ""}>
              <option value="">— Keep current —</option>
              {vehicles.map((v) => <option key={v.id} value={v.vehicleNumber}>{v.vehicleNumber} · {v.vehicleType}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setManageOpen(false)}>Cancel</Button>
            {manageStatusSelected === "CANCELLED" ? (
              <button 
                type="submit" 
                disabled={managing}
                className="px-4 py-2 text-sm rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {managing ? "Processing..." : "Cancel Shipment"}
              </button>
            ) : (
              <Button size="sm" type="submit" loading={managing}>Save Changes</Button>
            )}
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
