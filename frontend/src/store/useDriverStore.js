import { create } from "zustand";
import driverService from "../services/driverService";

const useDriverStore = create((set) => ({
  drivers: [],
  loading: false,
  error:   null,

  fetchDrivers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await driverService.getAll();
      set({ drivers: data, loading: false });
    } catch {
      set({ error: "Failed to load drivers", loading: false });
    }
  },

  addDriver: async (formData) => {
    const data = await driverService.create(formData);
    set((s) => ({ drivers: [data, ...s.drivers] }));
    return data;
  },

  deleteDriver: async (id) => {
    await driverService.delete(id);
    set((s) => ({ drivers: s.drivers.filter(d => d.id !== id) }));
  },
}));

export default useDriverStore;
