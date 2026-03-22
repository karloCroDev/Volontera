// External packages
import { notFound } from 'next/navigation';
import { dehydrate, QueryClient } from '@tanstack/react-query';

// Modules
import { CalendarGrid } from '@/modules/main/organization/calendar/calendar-grid';
import { DateTracker } from '@/modules/main/organization/calendar/date-tracker';
import { CalendarProvider } from '@/modules/main/organization/calendar/calendar-provider';

// Lib
import { retrieveOrganizationCalendar } from '@/lib/server/organization-calendar';

export default async function CalendarPage({
	params,
	searchParams,
}: {
	params: Promise<{ organizationId: string }>;
	searchParams: Promise<{ month?: string; year?: string }>;
}) {
	const { organizationId } = await params;
	const { month: monthParam, year: yearParam } = await searchParams;
	const now = new Date();

	const parsedMonth = Number(monthParam);
	const parsedYear = Number(yearParam);
	const hasValidMonthAndYear =
		Number.isInteger(parsedMonth) &&
		parsedMonth >= 1 &&
		parsedMonth <= 12 &&
		Number.isInteger(parsedYear) &&
		parsedYear >= 2026 &&
		parsedYear <= 9999;

	const month = hasValidMonthAndYear ? parsedMonth : now.getMonth() + 1;
	const year = hasValidMonthAndYear ? parsedYear : now.getFullYear();

	const calendarData = await retrieveOrganizationCalendar({
		organizationId,
		month,
		year,
	});

	if (!calendarData.success) notFound();

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: [organizationId, 'organization-calendar', year, month],
		queryFn: async () => calendarData,
	});
	const dehydratedState = dehydrate(queryClient);

	return (
		<CalendarProvider defaultFocusedDate={{ year, month, day: 1 }}>
			<div className="mb-6 flex flex-col justify-between gap-x-8 gap-y-4 overflow-x-scroll lg:flex-row lg:items-center">
				<div>
					<h4 className="text-xl lg:text-2xl">Calendar</h4>
					<p className="text-muted-foreground">
						All events that are happening inside this organization
					</p>
				</div>
				<div className="flex justify-between gap-4 lg:justify-start">
					<DateTracker />
				</div>
			</div>

			<div className="flex flex-1 overflow-x-scroll">
				<CalendarGrid dehydratedState={dehydratedState} />
			</div>
		</CalendarProvider>
	);
}
