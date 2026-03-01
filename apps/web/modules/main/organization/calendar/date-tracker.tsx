'use client';

// External packages
import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

// Modules
import { useCalendarContext } from '@/modules/main/organization/calendar/calendar-provider';

export const DateTracker = () => {
	const { monthLabel, nextMonth, prevMonth } = useCalendarContext();

	return (
		<Container className="border-input-border flex items-baseline justify-between gap-4 rounded-full border p-3">
			<Button
				variant="outline"
				colorScheme="bland"
				isFullyRounded
				className="p-2"
				onPress={prevMonth}
				size="xs"
			>
				<ChevronLeft className="size-4" />
			</Button>

			<p className="lg:text-md font-semibold" suppressHydrationWarning>
				{monthLabel}
			</p>

			<Button
				variant="outline"
				isFullyRounded
				colorScheme="bland"
				className="p-2"
				onPress={nextMonth}
				size="xs"
			>
				<ChevronRight className="size-4" />
			</Button>
		</Container>
	);
};
