import { z } from "zod";

export const mainSearchSchema = z.object({
  service: z.string().min(1, "Elige un servicio."),
  district: z.string().min(1, "Elige un distrito.")
});

export const bookingDraftSchema = z.object({
  serviceId: z.string().uuid(),
  districtId: z.string().uuid(),
  scheduledStart: z.string().datetime(),
  professionalId: z.string().uuid().optional(),
  customerNotes: z.string().max(800).optional()
});

export type MainSearchInput = z.infer<typeof mainSearchSchema>;
export type BookingDraftInput = z.infer<typeof bookingDraftSchema>;
