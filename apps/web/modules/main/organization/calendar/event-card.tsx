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

export const EventCard: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		time?: string;
		size?: 'sm' | 'lg';
	}
> = ({ time, size = 'sm' }) => {
	const markerStyle =
		'bg-success absolute left-1 h-[calc(100%-0.5rem)] w-1.5  rounded-full';
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
						<Container className="rounded-md p-2">Low priority</Container>
					</Tooltip>
					<AriaButton className="bg-success absolute left-1 h-[calc(100%-8px)] w-1.5 cursor-help rounded-full" />
				</TooltipTrigger>
			)}

			{size === 'sm' && <div className={markerStyle} />}
			<p className="ml-2">Task xxx</p>

			<div className="flex items-center gap-4">
				{time && (
					<>
						<div className="flex items-center gap-2 text-sm">
							<p className="text-muted-foreground">Time:</p>
							<p className="italic">{time}</p>
						</div>
						<Trash2 className="hover:text-destructive text-muted-foreground absolute size-4 cursor-pointer opacity-0 transition-opacity group-hover:static group-hover:opacity-100" />
					</>
				)}
			</div>
		</div>
	);
};
