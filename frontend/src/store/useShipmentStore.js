import { create } from "zustand";
import shipmentService from "../services/shipmentService";
import { toast } from "react-toastify";

const useShipmentStore = create((set, get) => ({
  shipments:     [],
  loading:       false,
  error:         null,
  notifications: [],   // { id, message, time, read }

  fetchShipments: async () => {
    set({ loading: true, error: null });
    try {
      const data = await shipmentService.getAll();
      set({ shipments: data, loading: false });
    } catch (err) {
      set({ error: "Failed to load shipments", loading: false });
    }
  },

  fetchMyShipments: async (email) => {
    set({ loading: true, error: null });
    try {
      const data = await shipmentService.getMyShipments(email);
      set({ shipments: data, loading: false });
    } catch (err) {
      set({ error: "Failed to load shipments", loading: false });
    }
  },

  addShipment: async (formData) => {
    const data = await shipmentService.create(formData);
    set((s) => ({
      shipments: [data, ...s.shipments],
      notifications: [
        { id: Date.now(), message: `New shipment created: ${data.trackingId}`, time: new Date(), read: false },
        ...s.notifications,
      ],
    }));
    return data;
  },

  updateShipment: async (trackingId, { status, driver, vehicle }) => {
    const tasks = [];
    if (status)  tasks.push(shipmentService.updateStatus(trackingId, status));
    if (driver)  tasks.push(shipmentService.assignDriver(trackingId, driver));
    if (vehicle) tasks.push(shipmentService.assignVehicle(trackingId, vehicle));
    const results = await Promise.all(tasks);
    const updated = results[results.length - 1]; // last result has all fields
    set((s) => ({
      shipments: s.shipments.map((sh) => sh.trackingId === trackingId ? { ...sh, ...updated } : sh),
      notifications: [
        { id: Date.now(), message: `Shipment ${trackingId} updated`, time: new Date(), read: false },
        ...s.notifications.slice(0, 19),
      ],
    }));
    return updated;
  },

  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));

export default useShipmentStore;
