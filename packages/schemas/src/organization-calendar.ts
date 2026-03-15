// External packages
import { z } from "zod";

// Schemas
import { organizationIdSchema } from "./organization";

const organizationCalendarStatusSchema = z.enum([
  "LOW_PRIORITY",
  "MEDIUM_PRIORITY",
  "HIGH_PRIORITY",
]);

export const retrieveOrganizationCalendarSchema = organizationIdSchema;
export type RetrieveOrganizationCalendarArgs = z.infer<
  typeof retrieveOrganizationCalendarSchema
>;

export const createOrganizationEventSchema = z
  .object({
    content: z.string().min(1).max(500),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    date: z.coerce.date(),
    status: organizationCalendarStatusSchema,
    calendarId: z.string(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });
export type CreateOrganizationEventArgs = z.infer<
  typeof createOrganizationEventSchema
>;

export const updateOrganizationEventSchema = z
  .object({
    eventId: z.cuid(),
    content: z.string().min(1).max(500),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });
export type UpdateOrganizationEventArgs = z.infer<
  typeof updateOrganizationEventSchema
>;

export const deleteOrganizationEventSchema = z.object({
  eventId: z.cuid(),
});
export type DeleteOrganizationEventArgs = z.infer<
  typeof deleteOrganizationEventSchema
>;
