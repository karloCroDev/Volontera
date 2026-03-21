// Database
import { OrganizationTasksAndCalendarStatus, prisma } from "@repo/database";

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
    ? new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0))
    : undefined;
  const monthEnd = shouldFilterByMonth
    ? new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))
    : undefined;

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
