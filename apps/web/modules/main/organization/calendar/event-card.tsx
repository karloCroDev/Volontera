'use client';

// External packages
import * as React from 'react';
import {
	Tooltip,
	TooltipTrigger,
	Button as AriaButton,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

// Components
import { Container } from '@/components/ui/container';
import { Trash2 } from 'lucide-react';

// Types
import type { RetrieveOrganizationCalendarResponse } from '@repo/types/organization-calendar';

type CalendarEvent =
	RetrieveOrganizationCalendarResponse['calendar']['events'][number];

const priorityColorMap: Record<CalendarEvent['status'], string> = {
	LOW_PRIORITY: 'bg-success',
	MEDIUM_PRIORITY: 'bg-pending',
	HIGH_PRIORITY: 'bg-destructive',
};

const priorityLabelMap: Record<CalendarEvent['status'], string> = {
	LOW_PRIORITY: 'Low priority',
	MEDIUM_PRIORITY: 'Medium priority',
	HIGH_PRIORITY: 'High priority',
};

function formatEventTime(date: Date | string) {
	const d = new Date(date);
	return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export const EventCard: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		size?: 'sm' | 'lg';
		event?: CalendarEvent;
		onDelete?: (eventId: string) => void;
		isDeleting?: boolean;
	}
> = ({ size = 'sm', event, onDelete, isDeleting = false }) => {
	const priorityColor = event ? priorityColorMap[event.status] : 'bg-success';
	const priorityLabel = event ? priorityLabelMap[event.status] : 'Low priority';
	const content = event?.content ?? 'Event';
	const timeRange = event
		? `${formatEventTime(event.startTime)} – ${formatEventTime(event.endTime)}`
		: undefined;

	const markerStyle = `${priorityColor} absolute left-1 h-[calc(100%-0.5rem)] w-1.5 rounded-full`;

	return (
		<div
			className={twMerge(
				'border-input-border group relative flex items-center justify-between rounded border',
				size === 'lg' && 'px-4 py-3',
				size === 'sm' && 'px-2 py-1'
			)}
		>
			{size === 'lg' && (
				<TooltipTrigger delay={250}>
					<Tooltip>
						<Container className="rounded-md p-2">{priorityLabel}</Container>
					</Tooltip>
					<AriaButton
						className={`${priorityColor} absolute left-1 h-[calc(100%-8px)] w-1.5 cursor-help rounded-full`}
					/>
				</TooltipTrigger>
			)}

			{size === 'sm' && <div className={markerStyle} />}
			<p className="ml-2 truncate">{content}</p>

			<div className="flex items-center gap-4">
				{size === 'lg' && (
					<>
						<div className="flex items-center gap-2 text-sm">
							<p className="text-muted-foreground">Time:</p>
							<p className="italic">{timeRange}</p>
						</div>
						<AriaButton
							onPress={() => event?.id && onDelete?.(event.id)}
							isDisabled={!event || !onDelete || isDeleting}
							className="hover:text-destructive text-muted-foreground absolute inline-flex size-4 cursor-pointer items-center justify-center opacity-0 transition-opacity disabled:pointer-events-none disabled:opacity-40 group-hover:static group-hover:opacity-100"
							aria-label="Delete event"
						>
							<Trash2 className="size-4" />
						</AriaButton>
					</>
				)}
			</div>
		</div>
	);
};
