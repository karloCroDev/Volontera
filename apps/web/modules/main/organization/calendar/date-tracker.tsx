'use client';

// External packages
import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { twJoin } from 'tailwind-merge';

// Components
import { Button } from '@/components/ui/button';

// Modules
import { useCalendarContext } from '@/modules/main/organization/calendar/calendar-provider';

export type DateTrackerProps = {
	className?: string;
};

export const DateTracker: React.FC<DateTrackerProps> = ({ className }) => {
	const { monthLabel, nextMonth, prevMonth } = useCalendarContext();

	return (
		<header
			className={twJoin(
				'border-input-border flex items-center justify-between gap-4 border-b p-4',
				className
			)}
		>
			<Button
				variant="outline"
				colorScheme="bland"
				isFullyRounded
				onPress={prevMonth}
			>
				<ChevronLeft className="size-4" />
			</Button>

			<p className="text-md font-semibold lg:text-lg" suppressHydrationWarning>
				{monthLabel}
			</p>

			<Button
				variant="outline"
				colorScheme="bland"
				isFullyRounded
				onPress={nextMonth}
			>
				<ChevronRight className="size-4" />
			</Button>
		</header>
	);
};
