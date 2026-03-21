'use client';

// External packages
import * as React from 'react';
import {
	Tooltip,
	TooltipTrigger,
	Button as AriaButton,
} from 'react-aria-components';
import { twJoin, twMerge } from 'tailwind-merge';
import { Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';

// Components
import { Container } from '@/components/ui/container';

// Types
import { RetrieveOrganizationCalendarResponse } from '@repo/types/organization-calendar';

// Hooks
import { useDeleteOrganizationEvent } from '@/hooks/data/organization-calendar';

// Lib
import { toast } from '@/lib/utils/toast';
import { formatIntervalTime } from '@/lib/utils/time-adjustments';

type CalendarEvent =
	RetrieveOrganizationCalendarResponse['calendar']['events'][number];

const priorityColorAndLabelObj: Record<
	CalendarEvent['status'],
	{ bg: string; label: string }
> = {
	LOW_PRIORITY: { bg: 'bg-success', label: 'Low priority' },
	MEDIUM_PRIORITY: { bg: 'bg-pending', label: 'Medium priority' },
	HIGH_PRIORITY: { bg: 'bg-destructive', label: 'High priority' },
};

export const EventCard: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		size?: 'sm' | 'lg';
		event: CalendarEvent;
	}
> = ({ size = 'sm', event }) => {
	const params = useParams<{ organizationId: string }>();
	const { mutate, isPending } = useDeleteOrganizationEvent();

	const priorityLabel = priorityColorAndLabelObj[event.status].label;

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
						className={twJoin(
							'absolute left-1 h-[calc(100%-0.5rem)] w-1.5 rounded-full',
							priorityColorAndLabelObj[event.status].bg
						)}
					/>
				</TooltipTrigger>
			)}

			{size === 'sm' && (
				<div
					className={twJoin(
						'absolute left-1 h-[calc(100%-0.5rem)] w-1.5 rounded-full',
						priorityColorAndLabelObj[event.status].bg
					)}
				/>
			)}
			<p className="ml-2 truncate">{event?.content}</p>

			<div className="flex items-center gap-4">
				{size === 'lg' && (
					<>
						<div className="flex items-center gap-2 text-sm">
							<p className="text-muted-foreground">Time:</p>
							<p className="italic">
								{formatIntervalTime(event.startTime)} -
								{formatIntervalTime(event.endTime)}
							</p>
						</div>
						<AriaButton
							onPress={() =>
								event.id &&
								mutate(
									{
										organizationId: params.organizationId,
										eventId: event.id,
									},
									{
										onError: ({ message, title }) => {
											toast({
												title,
												content: message,
												variant: 'error',
											});
										},
									}
								)
							}
							isDisabled={isPending}
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
