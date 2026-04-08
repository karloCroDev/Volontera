// Lib
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";
import { isBefore } from "date-fns";
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
  // servis vraca mjesecni presjek za trazenu godinu i organizaciju.
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

  // string datume odmah normalizujemo u date objekte radi sigurnijeg poredenja.

  // blokiramo kreiranje eventa u proslosti.
  if (isBefore(startTime, new Date())) {
    return toastResponseOutput({
      status: 400,
      title: "Invalid Event Date",
      message: "You cannot move events to the past.",
    });
  }

  // cuvamo kalendar od kolizije termina na isti dan.
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

  // event se upisuje tek nakon svih poslovnih validacija iznad.
  await createOrganizationEvent({
    calendarId: data.calendarId,
    content: data.content,
    date,
    startTime,
    endTime,
    status: data.status,
  });

  // notifikacije idu svim clanovima osim korisniku koji je kreirao event.
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

  if (isBefore(startTime, new Date())) {
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

  // kod update-a ignorisemo trenutni event da overlap provjera bude tacna.
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
  // delete je namjerno jednostavan: model sloj brine o samom uklanjanju zapisa.
  await deleteOrganizationEvent(eventId);

  return toastResponseOutput({
    status: 200,
    title: "Event Deleted",
    message: "Calendar event deleted successfully",
  });
}
