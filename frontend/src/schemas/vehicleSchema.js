import { z } from "zod";

const VEHICLE_TYPES    = ["Truck", "Van", "Bike", "Tempo", "Container", "Mini-Truck"];
const VEHICLE_STATUSES = ["AVAILABLE", "IN_USE", "MAINTENANCE", "INACTIVE"];

export const vehicleSchema = z.object({
  vehicleNumber:   z.string().min(1, "Vehicle number is required"),
  vehicleType:     z.enum(VEHICLE_TYPES, { errorMap: () => ({ message: "Select a vehicle type" }) }),
  capacity:        z.string().optional(),
  driverAssigned:  z.string().optional(),
  currentLocation: z.string().optional(),
  status:          z.enum(VEHICLE_STATUSES, { errorMap: () => ({ message: "Select a valid status" }) }),
});

export { VEHICLE_TYPES, VEHICLE_STATUSES };
