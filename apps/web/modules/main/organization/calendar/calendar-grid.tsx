'use client';

// External packages
import * as React from 'react';
import {
	Calendar,
	CalendarGrid as AriaCalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeaderCell,
} from 'react-aria-components';
import { getLocalTimeZone, today } from '@internationalized/date';
import { twJoin } from 'tailwind-merge';
import { useParams } from 'next/navigation';

// Modules
import { useCalendarContext } from '@/modules/main/organization/calendar/calendar-provider';
import { EventDialog } from '@/modules/main/organization/calendar/event-dialog';

// Hooks
import { useRetrieveOrganizationCalendar } from '@/hooks/data/organization-calendar';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const CalendarGrid = withReactQueryProvider(() => {
	const params = useParams<{ organizationId: string }>();
	const { timeZone, focusedDate, setFocusedDate } = useCalendarContext();
	const { data } = useRetrieveOrganizationCalendar({
		organizationId: params.organizationId,
	});

	const events = data?.calendar?.events ?? [];

	const defaultDate = React.useMemo(
		() => today(timeZone || getLocalTimeZone()),
		[timeZone]
	);

	const todayWeekday = React.useMemo(() => {
		const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
		return formatter.format(today(timeZone).toDate(timeZone));
	}, [timeZone]);

	return (
		<Calendar
			aria-label="Organization calendar"
			defaultFocusedValue={defaultDate}
			defaultValue={defaultDate}
			focusedValue={focusedDate}
			onFocusChange={setFocusedDate}
			className="w-full"
			firstDayOfWeek="mon"
		>
			<div className="border-input-border bg-muted w-full min-w-[850px] overflow-hidden rounded-lg border">
				<AriaCalendarGrid
					weekdayStyle="long"
					className="w-full table-fixed border-separate border-spacing-0"
				>
					<CalendarGridHeader className="border-input-border border-b">
						{(day) => (
							<CalendarHeaderCell
								className={twJoin(
									'border-input-border text-muted-foreground border-b border-r p-2 text-center text-xs font-medium last:border-r-0 lg:text-sm',
									day === todayWeekday && '!font-bold italic'
								)}
							>
								{day}
							</CalendarHeaderCell>
						)}
					</CalendarGridHeader>

					<CalendarGridBody>
						{(date) => {
							const dayEvents = events.filter((event) => {
								const d = new Date(event.date as unknown as string);
								return (
									d.getUTCFullYear() === date.year &&
									d.getUTCMonth() + 1 === date.month &&
									d.getUTCDate() === date.day
								);
							});
							return (
								<EventDialog
									date={date}
									events={dayEvents}
									calendarId={data.calendar.id}
									organizationId={params.organizationId}
									key={date.toString()}
								/>
							);
						}}
					</CalendarGridBody>
				</AriaCalendarGrid>
			</div>
		</Calendar>
	);
});
