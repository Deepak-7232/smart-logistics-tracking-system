import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  MdAdd, MdRefresh, MdEdit, MdPeople, MdDirectionsCar,
  MdVisibility, MdLocalShipping,
} from "react-icons/md";

import MainLayout from "../layouts/MainLayout";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { SkeletonTable } from "../components/ui/Skeleton";

import useShipmentStore from "../store/useShipmentStore";
import useDriverStore   from "../store/useDriverStore";
import useVehicleStore  from "../store/useVehicleStore";
import { useAuth }      from "../context/AuthContext";
import { shipmentSchema } from "../schemas/shipmentSchema";
import API from "../api/axios";

const STATUSES = ["PENDING", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function Shipments() {
  const { shipments, loading, fetchShipments, fetchMyShipments, addShipment } = useShipmentStore();
  const { drivers,  loading: dLoading, fetchDrivers }   = useDriverStore();
  const { vehicles, loading: vLoading, fetchVehicles }  = useVehicleStore();

  const { isAdmin, user } = useAuth();
  const admin = isAdmin();

  const [createOpen,           setCreateOpen]           = useState(false);
  const [manageOpen,           setManageOpen]           = useState(false);
  const [viewOpen,             setViewOpen]             = useState(false);
  const [selectedShip,         setSelectedShip]         = useState(null);
  const [managing,             setManaging]             = useState(false);
  const [manageStatusSelected, setManageStatusSelected] = useState("");

  useEffect(() => {
    if (admin) {
      fetchShipments();
      fetchDrivers();
      fetchVehicles();
    } else {
      if (user?.email) fetchMyShipments(user.email);
    }
  }, [admin, user]);

  /* ── Create form ── */
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

  /* ── Manage modal (admin) ── */
  const openManage = (ship) => {
    setSelectedShip(ship);
    setManageStatusSelected(ship.status);
    setManageOpen(true);
  };

  const openView = (ship) => {
    setSelectedShip(ship);
    setViewOpen(true);
  };

  const handleManage = async (e) => {
    e.preventDefault();
    if (!selectedShip) return;
    setManaging(true);
    const fd = new FormData(e.target);
    const status   = fd.get("status")  || "";
    const driverId = fd.get("driver")  || "";
    const vehicle  = fd.get("vehicle") || "";

    try {
      if (status !== selectedShip.status) {
        await API.put(`/shipments/update-status/${selectedShip.trackingId}?status=${encodeURIComponent(status)}`);
      }

      const currentDriverId = String(selectedShip?.driver?.id ?? "");
      if (driverId !== currentDriverId) {
        const driverUrl = driverId
          ? `/shipments/assign-driver/${selectedShip.trackingId}?driverId=${driverId}`
          : `/shipments/assign-driver/${selectedShip.trackingId}`;
        await API.put(driverUrl);
      }

      if (vehicle !== (selectedShip.vehicleAssigned ?? "")) {
        await API.put(`/shipments/assign-vehicle/${selectedShip.trackingId}?vehicle=${encodeURIComponent(vehicle)}`);
      }

      toast.success(status === "CANCELLED" ? "Shipment has been cancelled" : "Shipment updated!");
      await fetchShipments();
      fetchDrivers();
      fetchVehicles();
      setManageOpen(false);
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        (typeof err?.response?.data === "string" ? err.response.data : null);
      const display =
        typeof serverMsg === "string" && serverMsg.length > 0 && serverMsg.length < 120
          ? serverMsg
          : "Failed to update shipment — check driver availability or try again.";
      toast.dismiss("network-error");
      toast.error(display, { toastId: "manage-error" });
    } finally {
      setManaging(false);
    }
  };

  /* ── Column definitions ── */
  const columns = useMemo(() => [
    {
      accessorKey: "trackingId",
      header: "Tracking ID",
      cell: ({ getValue }) => (
        <span className="tracking-pill">{getValue()}</span>
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
          <span className="text-gray-500">{row.original.source}</span>
          <span className="text-gray-700 mx-1.5">→</span>
          <span className="text-gray-300">{row.original.destination}</span>
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <Badge status={getValue()} />,
    },
    {
      accessorKey: "driver",
      header: "Driver",
      cell: ({ getValue }) => getValue()?.name
        ? <span className="flex items-center gap-1.5 text-xs text-gray-300"><MdPeople className="text-gray-600" />{getValue().name}</span>
        : <span className="text-gray-700 text-xs italic">Unassigned</span>,
    },
    {
      accessorKey: "vehicleAssigned",
      header: "Vehicle",
      cell: ({ getValue }) => getValue()
        ? <span className="flex items-center gap-1.5 text-xs text-gray-300"><MdDirectionsCar className="text-gray-600" />{getValue()}</span>
        : <span className="text-gray-700 text-xs italic">Unassigned</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => admin ? (
        <button
          onClick={() => openManage(row.original)}
          className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300
                     hover:bg-primary-500/10 px-2 py-1 rounded transition-colors duration-150"
        >
          <MdEdit className="text-sm" /> Manage
        </button>
      ) : (
        <button
          onClick={() => openView(row.original)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300
                     hover:bg-app-elevated px-2 py-1 rounded transition-colors duration-150"
        >
          <MdVisibility className="text-sm" /> View
        </button>
      ),
    },
  ], [admin]);

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1>Shipments</h1>
          <p>{shipments.length} total shipments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary" size="sm"
            onClick={admin ? fetchShipments : () => user?.email && fetchMyShipments(user.email)}
          >
            <MdRefresh className="text-sm" /> Refresh
          </Button>
          {admin && (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <MdAdd className="text-sm" /> New Shipment
            </Button>
          )}
        </div>
      </div>

      {/* Read-only notice for drivers */}
      {!admin && (
        <div className="info-banner mb-4">
          <MdVisibility className="text-gray-600 flex-shrink-0" />
          You have <strong className="text-gray-300 mx-1">read-only</strong> access.
          Contact an administrator to make changes.
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <DataTable columns={columns} data={shipments} loading={loading} emptyMessage="No shipments found." />
      </div>

      {/* ── Create Modal ── */}
      {admin && (
        <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="New Shipment" size="lg" disableClose={submittingCreate}>
          <form onSubmit={hsCreate(onCreateSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Tracking ID *"   placeholder="TRK-2025-001" error={eCreate.trackingId?.message}   {...rCreate("trackingId")} />
              <div>
                <label className="form-label">Status</label>
                <select className="form-input" {...rCreate("status")}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                {eCreate.status && <p className="mt-1 text-[11px] text-red-400">{eCreate.status.message}</p>}
              </div>
              <Input label="Sender Name *"   placeholder="John Doe"   error={eCreate.senderName?.message}   {...rCreate("senderName")} />
              <Input label="Receiver Name *" placeholder="Jane Smith" error={eCreate.receiverName?.message} {...rCreate("receiverName")} />
              <Input label="Source *"        placeholder="Mumbai"     error={eCreate.source?.message}       {...rCreate("source")} />
              <Input label="Destination *"   placeholder="Delhi"      error={eCreate.destination?.message}  {...rCreate("destination")} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="secondary" size="sm" type="button" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button size="sm" type="submit" loading={submittingCreate}>Create Shipment</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Manage Modal ── */}
      {admin && (
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
              <div className="flex items-start gap-2.5 px-3 py-3 rounded-lg bg-red-500/8 border border-red-500/20 text-xs text-red-400">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <div>
                  <p className="font-semibold mb-0.5">Warning</p>
                  <p className="text-red-400/80">Cancelling a shipment is permanent and cannot be undone.</p>
                </div>
              </div>
            )}

            <div>
              <label className="form-label">Assign Driver</label>
              <select name="driver" className="form-input" defaultValue={selectedShip?.driver?.id ?? ""}>
                <option value="">— Unassigned —</option>
                {drivers
                  .filter((d) => d.available || d.id === selectedShip?.driver?.id)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.phone}){!d.available ? " · assigned here" : ""}
                    </option>
                  ))
                }
              </select>
            </div>
            <div>
              <label className="form-label">Assign Vehicle</label>
              <select name="vehicle" className="form-input" defaultValue={selectedShip?.vehicleAssigned ?? ""}>
                <option value="">— Unassigned —</option>
                {vehicles.map((v) => <option key={v.id} value={v.vehicleNumber}>{v.vehicleNumber} · {v.vehicleType}</option>)}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="secondary" size="sm" type="button" onClick={() => setManageOpen(false)}>Cancel</Button>
              {manageStatusSelected === "CANCELLED" ? (
                <Button variant="danger" size="sm" type="submit" loading={managing}>Cancel Shipment</Button>
              ) : (
                <Button size="sm" type="submit" loading={managing}>Save Changes</Button>
              )}
            </div>
          </form>
        </Modal>
      )}

      {/* ── View Modal (driver read-only) ── */}
      {!admin && selectedShip && (
        <Modal isOpen={viewOpen} onClose={() => setViewOpen(false)} title={`Shipment · ${selectedShip?.trackingId}`}>
          <div className="space-y-0 divide-y divide-app-border">
            {[
              ["Tracking ID",   <span className="tracking-pill">{selectedShip.trackingId}</span>],
              ["Sender",        selectedShip.senderName],
              ["Receiver",      selectedShip.receiverName],
              ["Route",         `${selectedShip.source} → ${selectedShip.destination}`],
              ["Driver",        selectedShip.driver?.name || "Unassigned"],
              ["Vehicle",       selectedShip.vehicleAssigned || "Unassigned"],
              ["Status",        <Badge status={selectedShip.status} />],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <span className="text-[11px] text-gray-600 uppercase tracking-wide">{label}</span>
                <span className="text-sm text-gray-200 font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="secondary" size="sm" onClick={() => setViewOpen(false)}>Close</Button>
          </div>
        </Modal>
      )}
    </MainLayout>
  );
}
