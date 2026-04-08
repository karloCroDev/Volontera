// Types
import {
  addDays,
  eachWeekOfInterval,
  format,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { DashboardDurationDays } from "@repo/types/dashboard";

type DashboardKPIRows = {
  volunteerRows: { createdAt: Date }[];
  organizationRows: { createdAt: Date }[];
  organizatorRows: { createdAt: Date }[];
};

type WeeklyKPI = {
  week: string;
  totalVolunteers: number;
  totalOrganizations: number;
  totalOrganizators: number;
};

export function getSinceDate(durationDays: DashboardDurationDays) {
  return startOfDay(subDays(new Date(), durationDays));
}

function startOfWeekMonday(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

function groupRowsByWeekCount(items: Array<{ createdAt: Date }>) {
  const map = new Map<string, number>();

  for (const item of items) {
    const weekStart = startOfWeekMonday(item.createdAt);
    const key = format(weekStart, "yyyy-MM-dd");
    const current = map.get(key) ?? 0;
    map.set(key, current + 1);
  }

  return map;
}

function formatWeekLabel(weekStart: Date) {
  const weekEnd = addDays(weekStart, 6);
  return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`;
}

// Ideja je da podatke koje dobijemo iz baze formatiramo u seriju podataka grupiranu po 7 dana kako bi dobili dobar uvid u datumske trendove linisjki chartova
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

  const series = eachWeekOfInterval(
    {
      start: startWeek,
      end: currentWeek,
    },
    {
      weekStartsOn: 1,
    },
  ).map((weekStart) => {
    const key = format(weekStart, "yyyy-MM-dd");

    return {
      week: formatWeekLabel(weekStart),
      totalVolunteers: volunteersByWeek.get(key) ?? 0,
      totalOrganizations: organizationsByWeek.get(key) ?? 0,
      totalOrganizators: organizatorsByWeek.get(key) ?? 0,
    };
  });

  return series;
}
