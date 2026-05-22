import { z } from "zod";

export const driverSchema = z.object({
  name:            z.string().min(2, "Name must be at least 2 characters"),
  phone:           z.string()
                     .min(7,  "Phone number too short")
                     .max(15, "Phone number too long")
                     .regex(/^\+?[0-9\s\-().]+$/, "Enter a valid phone number"),
  licenseNumber:   z.string().optional(),
  vehicleAssigned: z.string().optional(),
});
