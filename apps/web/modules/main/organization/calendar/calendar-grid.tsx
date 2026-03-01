'use client';

// External packages
import * as React from 'react';
import {
	Calendar,
	CalendarCell,
	CalendarGrid as AriaCalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeaderCell,
} from 'react-aria-components';
import { getLocalTimeZone, today } from '@internationalized/date';
import { twJoin } from 'tailwind-merge';

// Modules
import { useCalendarContext } from '@/modules/main/organization/calendar/calendar-provider';

export const CalendarGrid = () => {
	const { timeZone, focusedDate, setFocusedDate } = useCalendarContext();

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
			<div className="border-input-border bg-muted w-full min-w-[800px] overflow-hidden rounded-lg border">
				<AriaCalendarGrid
					weekdayStyle="long"
					className="w-full table-fixed border-separate border-spacing-0"
				>
					<CalendarGridHeader className="border-input-border border-b">
						{(day) => (
							<CalendarHeaderCell
								className={twJoin(
									'border-input-border text-muted-foreground border-r p-2 text-center text-xs font-medium last:border-r-0 lg:text-sm',
									day === todayWeekday && '!font-bold italic'
								)}
							>
								{day}
							</CalendarHeaderCell>
						)}
					</CalendarGridHeader>

					<CalendarGridBody>
						{(date) => (
							<CalendarCell
								date={date}
								// onClick={() => onDatePress?.(date)}
								className={twJoin(
									'border-input-border group relative h-28 w-full cursor-pointer border-b border-r p-2 text-left align-top outline-none',
									'focus-visible:ring-primary focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
									'data-[hovered]:bg-accent/30 data-[pressed]:bg-accent/50',
									'data-[selected]:bg-accent/40',
									'data-[outside-month]:bg-background data-[outside-month]:text-muted-foreground',
									'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
								)}
							>
								<div className="flex items-start justify-between">
									<span className="text-sm font-medium">{date.day}</span>
								</div>

								{/*
									Slot for your per-date dialog content.
									You can replace/augment this area with a DialogTrigger later.
								*/}
								<div
									className="mt-2 min-h-0 flex-1"
									data-calendar-cell-content
								/>
							</CalendarCell>
						)}
					</CalendarGridBody>
				</AriaCalendarGrid>
			</div>
		</Calendar>
	);
};
