'use client';

// External packages
import * as React from 'react';
import { CalendarCellProps } from 'react-aria-components';
import { CalendarCell } from 'react-aria-components';
import { today } from '@internationalized/date';

// Components
import { Dialog } from '@/components/ui/dialog';

// Modules
import { EventCard } from '@/modules/main/organization/calendar/event-card';
import { AddEventForm } from '@/modules/main/organization/calendar/add-event-form';

// Types
import { RetrieveOrganizationCalendarResponse } from '@repo/types/organization-calendar';

// Lib
import { formatDate } from '@/lib/utils/time-adjustments';

export const EventDialog: React.FC<{
	date: CalendarCellProps['date'];
	events: RetrieveOrganizationCalendarResponse['calendar']['events'][number][];
	calendarId: string;
	timeZone: string;
}> = ({ date, events, calendarId, timeZone }) => {
	const isPastDate = React.useMemo(
		() => date.compare(today(timeZone)) < 0,
		[date, timeZone]
	);

	const dayCell = (
		<CalendarCell
			date={date}
			className="border-input-border data-[hovered]:bg-accent/30 data-[pressed]:bg-accent/50 data-[selected]:bg-accent/40 data-[unavailable]:bg-background data-[unavailable]:text-muted-foreground data-[outside-month]:bg-background group relative flex h-28 w-full cursor-pointer flex-col border-b border-r p-2 text-left align-top outline-none data-[unavailable]:cursor-not-allowed data-[outside-month]:opacity-50 data-[unavailable]:opacity-50"
		>
			<span className="text-sm">{date.day}</span>

			<div className="mt-2 flex flex-1 flex-col gap-2 overflow-scroll">
				{events.slice(0, 3).map((event) => (
					<EventCard key={event.id} event={event} />
				))}
			</div>
		</CalendarCell>
	);

	if (isPastDate) {
		return dayCell;
	}

	return (
		<Dialog
			triggerChildren={dayCell}
			// Vrati iso format datuma, te nije problem formatirati ga kao string za date objekt
			title={`Events on: ${formatDate(date.toString())}`}
			subtitle="All events based on the given date"
		>
			<div>
				<div className="my-4 flex max-h-60 flex-col gap-3 overflow-y-scroll">
					{events.length > 0 ? (
						events.map((event) => (
							<EventCard key={event.id} event={event} size="lg" />
						))
					) : (
						<p className="text-muted-foreground py-4 text-center text-sm">
							No events for this day.
						</p>
					)}
				</div>

				<hr className="bg-input-border my-6 h-px w-full border-0" />

				<AddEventForm calendarId={calendarId} date={date} />
			</div>
		</Dialog>
	);
};

const DayCell = () => {
	return;
};
