// Types
import type { DashboardDurationDays } from "@repo/types/dashboard";

export type DashboardKPIRows = {
  volunteerRows: Array<{ createdAt: Date }>;
  organizationRows: Array<{ createdAt: Date }>;
  organizatorRows: Array<{ createdAt: Date }>;
};

export type WeeklyKPI = {
  week: string;
  totalVolunteers: number;
  totalOrganizations: number;
  totalOrganizators: number;
};

const DATE_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function getSinceDate(durationDays: DashboardDurationDays) {
  const since = new Date();
  since.setDate(since.getDate() - durationDays);
  since.setHours(0, 0, 0, 0);
  return since;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfWeekMonday(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);

  const day = value.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  value.setDate(value.getDate() + diff);

  return value;
}

function addDays(date: Date, days: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function groupRowsByWeekCount(items: Array<{ createdAt: Date }>) {
  const map = new Map<string, number>();

  for (const item of items) {
    const weekStart = startOfWeekMonday(item.createdAt);
    const key = toDateKey(weekStart);
    const current = map.get(key) ?? 0;
    map.set(key, current + 1);
  }

  return map;
}

function formatWeekLabel(weekStart: Date) {
  const weekEnd = addDays(weekStart, 6);
  return `${DATE_LABEL_FORMATTER.format(weekStart)} - ${DATE_LABEL_FORMATTER.format(weekEnd)}`;
}

export function buildWeeklyKPISeries({
  since,
  kpiRows,
}: {
  since: Date;
  kpiRows: DashboardKPIRows;
}): WeeklyKPI[] {
  const volunteersByWeek = groupRowsByWeekCount(kpiRows.volunteerRows);
  const organizationsByWeek = groupRowsByWeekCount(kpiRows.organizationRows);
  const organizatorsByWeek = groupRowsByWeekCount(kpiRows.organizatorRows);

  const startWeek = startOfWeekMonday(since);
  const currentWeek = startOfWeekMonday(new Date());

  const series: WeeklyKPI[] = [];
  const cursor = new Date(startWeek);

  while (cursor <= currentWeek) {
    const key = toDateKey(cursor);

    series.push({
      week: formatWeekLabel(cursor),
      totalVolunteers: volunteersByWeek.get(key) ?? 0,
      totalOrganizations: organizationsByWeek.get(key) ?? 0,
      totalOrganizators: organizatorsByWeek.get(key) ?? 0,
    });

    cursor.setDate(cursor.getDate() + 7);
  }

  return series;
}
