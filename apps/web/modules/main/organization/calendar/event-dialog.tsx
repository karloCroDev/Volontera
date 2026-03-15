'use client';

// External packages
import * as React from 'react';
import { CalendarCellProps } from 'react-aria-components';
import { CalendarCell } from 'react-aria-components';
import { twJoin } from 'tailwind-merge';

// Components
import { Dialog } from '@/components/ui/dialog';

// Modules
import { EventCard } from '@/modules/main/organization/calendar/event-card';
import { AddEventForm } from '@/modules/main/organization/calendar/add-event-form';

// Lib
import { formatDate } from '@/lib/utils/time-adjustments';

export const EventDialog: React.FC<{
	date: CalendarCellProps['date'];
}> = ({ date }) => {
	return (
		<Dialog
			triggerChildren={
				<CalendarCell
					date={date}
					// onClick={() => onDatePress?.(date)}
					className={twJoin(
						'border-input-border group relative flex h-28 w-full cursor-pointer flex-col border-b border-r p-2 text-left align-top outline-none',
						'data-[hovered]:bg-accent/30 data-[pressed]:bg-accent/50',
						'data-[selected]:bg-accent/40',
						'data-[outside-month]:bg-background data-[outside-month]:text-muted-foreground',
						'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
					)}
				>
					<span className="text-sm">{date.day}</span>

					<div className="mt-2 flex flex-1 flex-col gap-2 overflow-scroll">
						{[...Array(8)].map((_, indx) => (
							<EventCard key={indx} />
						))}
					</div>
				</CalendarCell>
			}
			// Vrati iso format datuma, te nije problem formatirati ga kao string za date objekt
			title={`Events on: ${formatDate(date.toString())}`}
			subtitle="All events based on the given date"
		>
			<div>
				<div className="my-4 flex max-h-60 flex-col gap-3 overflow-y-scroll">
					{[...Array(8)].map((_, indx) => (
						<EventCard key={indx} time={`${9 + indx}:00`} size="lg" />
					))}
				</div>

				<hr className="bg-input-border my-6 h-px w-full border-0" />

				<AddEventForm />
			</div>
		</Dialog>
	);
};
