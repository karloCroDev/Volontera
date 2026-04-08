// Lib
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";
import { createMultipleNotifications } from "@/models/notification.model";

// Models
import {
  createOrganizationEvent,
  deleteOrganizationEvent,
  findOverlappingOrganizationEvent,
  retrieveOrganizationCalendar,
  retrieveOrganizationCalendarEventById,
  updateOrganizationEvent,
} from "@/models/organization-calendar.model";
import { retrieveOrganizationMembers } from "@/models/organization-tasks.model";

// Schemas
import {
  CreateOrganizationEventArgs,
  DeleteOrganizationEventArgs,
  RetrieveOrganizationCalendarArgs,
  UpdateOrganizationEventArgs,
} from "@repo/schemas/organization-calendar";
import { User } from "@repo/database";

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

export async function createOrganizationEventService({
  data,
  userId,
}: {
  data: CreateOrganizationEventArgs;
  userId: User["id"];
}) {
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);
  const date = new Date(data.date);

  if (startTime.getTime() < Date.now()) {
    return toastResponseOutput({
      status: 400,
      title: "Invalid Event Date",
      message: "You cannot move events to the past.",
    });
  }

  const overlappingEvent = await findOverlappingOrganizationEvent({
    calendarId: data.calendarId,
    date,
    startTime,
    endTime,
  });

  if (overlappingEvent) {
    return toastResponseOutput({
      status: 400,
      title: "Overlapping Event",
      message: "This time interval overlaps with another event on that day.",
    });
  }

  await createOrganizationEvent({
    calendarId: data.calendarId,
    content: data.content,
    date,
    startTime,
    endTime,
    status: data.status,
  });

  const members = await retrieveOrganizationMembers(data.organizationId);
  const membersToNotify = members.filter((member) => member.userId !== userId);

  await createMultipleNotifications(
    membersToNotify.map((member) => ({
      userId: member.userId,
      senderId: userId,
      content: `A new event has been added to the calendar of the organization. Event content: ${data.content}`,
    })),
  );

  return toastResponseOutput({
    status: 200,
    title: "Event Created",
    message: "Calendar event created successfully",
  });
}

// TODO: Vidi hoću li updateanje organizacija implementirati na frontendu
export async function updateOrganizationEventService(
  data: UpdateOrganizationEventArgs,
) {
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  if (startTime.getTime() < Date.now()) {
    return toastResponseOutput({
      status: 400,
      title: "Invalid Event Date",
      message: "You cannot move events to the past.",
    });
  }

  const existingEvent = await retrieveOrganizationCalendarEventById(
    data.eventId,
  );

  if (!existingEvent) {
    return toastResponseOutput({
      status: 400,
      title: "Event Not Found",
      message: "The selected event no longer exists.",
    });
  }

  const overlappingEvent = await findOverlappingOrganizationEvent({
    calendarId: existingEvent.calendarId,
    date: existingEvent.date,
    startTime,
    endTime,
    excludeEventId: data.eventId,
  });

  if (overlappingEvent) {
    return toastResponseOutput({
      status: 400,
      title: "Overlapping Event",
      message: "This time interval overlaps with another event on that day.",
    });
  }

  await updateOrganizationEvent({
    eventId: data.eventId,
    content: data.content,
    startTime,
    endTime,
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
