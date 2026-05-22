import { create } from "zustand";
import vehicleService from "../services/vehicleService";

const useVehicleStore = create((set) => ({
  vehicles: [],
  loading:  false,
  error:    null,

  fetchVehicles: async () => {
    set({ loading: true, error: null });
    try {
      const data = await vehicleService.getAll();
      set({ vehicles: data, loading: false });
    } catch {
      set({ error: "Failed to load vehicles", loading: false });
    }
  },

  addVehicle: async (formData) => {
    const data = await vehicleService.create(formData);
    set((s) => ({ vehicles: [data, ...s.vehicles] }));
    return data;
  },

  deleteVehicle: async (id) => {
    await vehicleService.delete(id);
    set((s) => ({ vehicles: s.vehicles.filter(v => v.id !== id) }));
  },
}));

export default useVehicleStore;
