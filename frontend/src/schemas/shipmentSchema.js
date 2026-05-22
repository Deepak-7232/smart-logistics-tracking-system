import { z } from "zod";

const STATUSES = ["PENDING", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export const shipmentSchema = z.object({
  trackingId:   z.string().min(1, "Tracking ID is required"),
  senderName:   z.string().min(2, "Sender name must be at least 2 characters"),
  receiverName: z.string().min(2, "Receiver name must be at least 2 characters"),
  source:       z.string().min(1, "Source location is required"),
  destination:  z.string().min(1, "Destination is required"),
  status:       z.enum(STATUSES, { errorMap: () => ({ message: "Invalid status" }) }),
});

export const assignSchema = z.object({
  status:  z.string().optional(),
  driver:  z.string().optional(),
  vehicle: z.string().optional(),
});
