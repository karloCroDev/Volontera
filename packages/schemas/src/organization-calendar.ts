// External packages
import { z } from "zod";

// Schemas
import { organizationIdSchema } from "./organization";

const organizationCalendarStatusSchema = z.enum([
  "LOW_PRIORITY",
  "MEDIUM_PRIORITY",
  "HIGH_PRIORITY",
]);

function getStartOfCurrentUtcDay() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

export const retrieveOrganizationCalendarSchema = organizationIdSchema;
const retrieveOrganizationCalendarFiltersSchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(1970).max(9999).optional(),
});

export const retrieveOrganizationCalendarQuerySchema =
  retrieveOrganizationCalendarFiltersSchema.refine(
    (data) =>
      (data.month === undefined && data.year === undefined) ||
      (data.month !== undefined && data.year !== undefined),
    {
      message: "Month and year must be provided together",
      path: ["month"],
    },
  );

export const retrieveOrganizationCalendarArgsSchema =
  retrieveOrganizationCalendarSchema
    .extend(retrieveOrganizationCalendarFiltersSchema.shape)
    .refine(
      (data) =>
        (data.month === undefined && data.year === undefined) ||
        (data.month !== undefined && data.year !== undefined),
      {
        message: "Month and year must be provided together",
        path: ["month"],
      },
    );

export type RetrieveOrganizationCalendarQueryArgs = z.infer<
  typeof retrieveOrganizationCalendarQuerySchema
>;
export type RetrieveOrganizationCalendarArgs = z.infer<
  typeof retrieveOrganizationCalendarArgsSchema
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
  .extend(organizationIdSchema.shape)
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine((data) => data.date >= getStartOfCurrentUtcDay(), {
    message: "Cannot create events in the past",
    path: ["date"],
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
  .extend(organizationIdSchema.shape)
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });
export type UpdateOrganizationEventArgs = z.infer<
  typeof updateOrganizationEventSchema
>;

export const deleteOrganizationEventSchema = z
  .object({ eventId: z.cuid() })
  .extend(organizationIdSchema.shape);
export type DeleteOrganizationEventArgs = z.infer<
  typeof deleteOrganizationEventSchema
>;
