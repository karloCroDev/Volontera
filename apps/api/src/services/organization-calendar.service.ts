// Lib
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";

// Models
import {
  createOrganizationEvent,
  deleteOrganizationEvent,
  retrieveOrganizationCalendar,
  updateOrganizationEvent,
} from "@/models/organization-calendar.model";

// Schemas
import {
  CreateOrganizationEventArgs,
  DeleteOrganizationEventArgs,
  RetrieveOrganizationCalendarArgs,
  UpdateOrganizationEventArgs,
} from "@repo/schemas/organization-calendar";

export async function retrieveOrganizationCalendarService({
  organizationId,
  month,
  year,
}: RetrieveOrganizationCalendarArgs) {
  const calendar = await retrieveOrganizationCalendar({
    organizationId,
    month,
    year,
  });

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Calendar retrieved successfully",
    data: { calendar },
  });
}

export async function createOrganizationEventService(
  data: CreateOrganizationEventArgs,
) {
  await createOrganizationEvent({
    calendarId: data.calendarId,
    content: data.content,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    status: data.status,
  });

  return toastResponseOutput({
    status: 200,
    title: "Event Created",
    message: "Calendar event created successfully",
  });
}

export async function updateOrganizationEventService(
  data: UpdateOrganizationEventArgs,
) {
  await updateOrganizationEvent({
    eventId: data.eventId,
    content: data.content,
    startTime: data.startTime,
    endTime: data.endTime,
  });

  return toastResponseOutput({
    status: 200,
    title: "Event Updated",
    message: "Calendar event updated successfully",
  });
}

export async function deleteOrganizationEventService({
  eventId,
}: DeleteOrganizationEventArgs) {
  await deleteOrganizationEvent(eventId);

  return toastResponseOutput({
    status: 200,
    title: "Event Deleted",
    message: "Calendar event deleted successfully",
  });
}
