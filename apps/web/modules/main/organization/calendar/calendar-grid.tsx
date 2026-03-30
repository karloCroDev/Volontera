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
import { DateValue, getLocalTimeZone, today } from '@internationalized/date';
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
	const resolvedTimeZone = timeZone || getLocalTimeZone();
	const { data } = useRetrieveOrganizationCalendar({
		organizationId: params.organizationId,
		month: focusedDate.month,
		year: focusedDate.year,
	});

	const events = data?.calendar?.events ?? [];

	const todayDate = React.useMemo(
		() => today(resolvedTimeZone),
		[resolvedTimeZone]
	);

	const todayWeekday = React.useMemo(() => {
		const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
		return formatter.format(todayDate.toDate(resolvedTimeZone));
	}, [todayDate, resolvedTimeZone]);

	const isDateUnavailable = React.useCallback(
		(date: DateValue) => date.compare(todayDate) < 0,
		[todayDate]
	);
	return (
		<Calendar
			aria-label="Organization calendar"
			defaultFocusedValue={today(resolvedTimeZone)}
			defaultValue={today(resolvedTimeZone)}
			focusedValue={focusedDate}
			onFocusChange={setFocusedDate}
			isDateUnavailable={isDateUnavailable}
			className="min-h-[500px] w-full flex-1 overflow-x-scroll"
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
									d.getFullYear() === date.year &&
									d.getMonth() + 1 === date.month &&
									d.getDate() === date.day
								);
							});
							return (
								<EventDialog
									date={date}
									events={dayEvents}
									calendarId={data.calendar.id}
									timeZone={resolvedTimeZone}
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
