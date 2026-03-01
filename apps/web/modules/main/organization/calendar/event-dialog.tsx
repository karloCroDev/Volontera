'use client';

// External packages
import * as React from 'react';

// Components
import { Dialog } from '@/components/ui/dialog';
import {
	Button as AriaButton,
	CalendarCell,
	CellProps,
} from 'react-aria-components';
import { twJoin } from 'tailwind-merge';
import { formatDate, formatTime } from '@/lib/utils/time-adjustments';

export const EventDialog: React.FC<{
	date: any;
}> = ({ date }) => {
	return (
		<Dialog
			triggerChildren={
				<CalendarCell
					date={date}
					// onClick={() => onDatePress?.(date)}
					className={twJoin(
						'border-input-border group relative h-28 w-full cursor-pointer border-b border-r p-2 text-left align-top outline-none',
						'data-[hovered]:bg-accent/30 data-[pressed]:bg-accent/50',
						'data-[selected]:bg-accent/40',
						'data-[outside-month]:bg-background data-[outside-month]:text-muted-foreground',
						'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
					)}
				>
					<div>
						<div className="flex items-start justify-between">
							<span className="text-sm font-medium">{date.day}</span>
						</div>
					</div>
				</CalendarCell>
			}
			title={`Events on: ${formatDate(date.toDate())}`}
			subtitle="All events based on the given date"
		>
			<div className="my-4"></div>
		</Dialog>
	);
};
