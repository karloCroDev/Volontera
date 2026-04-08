// Database
import { OrganizationTasksAndCalendarStatus, prisma } from "@repo/database";
import { addDays, addMonths, startOfDay, startOfMonth } from "date-fns";

export async function retrieveOrganizationCalendar({
  organizationId,
  month,
  year,
}: {
  organizationId: string;
  month?: number;
  year?: number;
}) {
  const shouldFilterByMonth = month !== undefined && year !== undefined;
  const monthStart = shouldFilterByMonth
    ? startOfMonth(new Date(year, month - 1, 1))
    : undefined;
  const monthEnd = shouldFilterByMonth ? addMonths(monthStart!, 1) : undefined;

  return await prisma.organizationCalendar.findUnique({
    where: {
      organizationId,
    },
    include: {
      events: shouldFilterByMonth
        ? {
            where: {
              date: {
                gte: monthStart,
                lt: monthEnd,
              },
            },
            orderBy: [{ date: "asc" }, { startTime: "asc" }],
          }
        : {
            orderBy: [{ date: "asc" }, { startTime: "asc" }],
          },
    },
  });
}

export async function createOrganizationEvent({
  calendarId,
  content,
  endTime,
  startTime,
  status,
  date,
}: {
  startTime: Date;
  endTime: Date;
  content: string;
  calendarId: string;
  status: OrganizationTasksAndCalendarStatus;
  date: Date;
}) {
  return await prisma.organizationCalendarEvent.create({
    data: {
      status,
      endTime,
      date,
      startTime,
      content,
      calendarId,
    },
  });
}

export async function findOverlappingOrganizationEvent({
  calendarId,
  date,
  startTime,
  endTime,
  excludeEventId,
}: {
  calendarId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  excludeEventId?: string;
}) {
  const dayStart = startOfDay(date);
  const dayEnd = addDays(dayStart, 1);

  return await prisma.organizationCalendarEvent.findFirst({
    where: {
      calendarId,
      date: {
        gte: dayStart,
        lt: dayEnd,
      },
      id: excludeEventId
        ? {
            not: excludeEventId,
          }
        : undefined,
      startTime: {
        lt: endTime,
      },
      endTime: {
        gt: startTime,
      },
    },
    select: {
      id: true,
    },
  });
}

export async function retrieveOrganizationCalendarEventById(eventId: string) {
  return await prisma.organizationCalendarEvent.findUnique({
    where: {
      id: eventId,
    },
    select: {
      id: true,
      calendarId: true,
      date: true,
    },
  });
}

export async function deleteOrganizationEvent(eventId: string) {
  return await prisma.organizationCalendarEvent.delete({
    where: {
      id: eventId,
    },
  });
}

export async function updateOrganizationEvent({
  eventId,
  content,
  endTime,
  startTime,
}: {
  eventId: string;
  content: string;
  startTime: Date;
  endTime: Date;
}) {
  return await prisma.organizationCalendarEvent.update({
    where: {
      id: eventId,
    },
    data: {
      content,
      startTime,
      endTime,
    },
  });
}
