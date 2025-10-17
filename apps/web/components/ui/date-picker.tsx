// External packages
import * as React from 'react';
import {
	Calendar,
	CalendarCell,
	CalendarGrid,
	DateInput,
	DatePicker,
	DatePickerProps,
	DateSegment,
	DateValue,
	Dialog,
	Group,
	Heading,
	Popover,
} from 'react-aria-components';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { twJoin } from 'tailwind-merge';

// Components
import { getTextFieldBasicStyles } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const DatePciker = <T extends DateValue>({
	...rest
}: DatePickerProps<T>) => {
	return (
		<DatePicker {...rest}>
			<Group className="flex items-center justify-between">
				<Button
					variant="blank"
					className={twJoin(
						getTextFieldBasicStyles,
						'flex items-center justify-between px-4'
					)}
				>
					<DateInput>
						{(segment) => (
							<DateSegment
								className="focus:bg-primary outline-none"
								segment={segment}
							/>
						)}
					</DateInput>
					<ChevronDown className="size-4" />
				</Button>
			</Group>
			<Popover>
				<Dialog>
					<Calendar className="bg-muted flex flex-col items-center justify-center rounded p-4">
						<header className="flex items-center gap-4">
							<Button slot="previous" isFullyRounded>
								<ChevronLeft className="size-4" />
							</Button>
							<Heading />
							<Button slot="next" isFullyRounded>
								<ChevronRight className="size-4" />
							</Button>
						</header>
						<CalendarGrid className="mt-3">
							{(date) => (
								<CalendarCell
									className="data-[pressed]:bg-pending data-[outside-month]:text-popover data-[selected]:bg-accent flex h-6 cursor-pointer items-center justify-center rounded px-2 py-4 text-center"
									date={date}
								/>
							)}
						</CalendarGrid>
					</Calendar>
				</Dialog>
			</Popover>
		</DatePicker>
	);
};
