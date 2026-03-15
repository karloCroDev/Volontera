'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';
import {
	Input as AriaInput,
	Form,
	Radio,
	RadioGroup,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

// Components
import { Button } from '@/components/ui/button';
import { getTextFieldBasicStyles } from '@/components/ui/input';
import { Tag } from '@/components/ui/tag';
import { Dot } from '@/components/ui/dot';
import { RadioIconVisual } from '@/components/ui/radio';
import { ResizableTextArea } from '@/components/ui/resizable-input';

// TODO: Change this once I get from prisma for the sake of consistency
type Priority = 'LOW_PRIORITY' | 'MEDIUM_PRIORITY' | 'HIGH_PRIORITY';
export const AddEventForm = () => {
	const [priority, setPriority] = React.useState<Priority>('MEDIUM_PRIORITY');
	const [startTime, setStartTime] = React.useState<string>('09:00');
	const [endTime, setEndTime] = React.useState<string>('10:00');

	const stopCalendarNavigationKeys = (e: React.KeyboardEvent) => {
		// CalendarCell koristi za accessibilty Space/Enter, pa ovo je da prestanemo sa propagacijom na druge elemente
		if (e.key === ' ' || e.key === 'Enter') {
			e.stopPropagation();
		}
	};
	const handleStartTimeChange = (newStartTime: string) => {
		setStartTime(newStartTime);
		if (endTime < newStartTime) {
			setEndTime(newStartTime);
		}
	};

	const handleEndTimeChange = (newEndTime: string) => {
		setEndTime(newEndTime < startTime ? startTime : newEndTime);
	};
	return (
		<Form className="flex flex-col gap-2">
			<div className="flex flex-col md:flex-row md:justify-between">
				<div className="flex gap-3">
					<div>
						<p className="text-muted-foreground mb-1 text-xs">Start time</p>
						<AriaInput
							aria-label="Event start time"
							type="time"
							value={startTime}
							onChange={(e) => handleStartTimeChange(e.target.value)}
							onKeyDown={stopCalendarNavigationKeys}
							className={twMerge(
								getTextFieldBasicStyles,
								'h-10 w-28 px-2 pt-0 text-sm'
							)}
						/>
					</div>

					<div>
						<p className="text-muted-foreground mb-1 text-xs">End time</p>
						<AriaInput
							aria-label="Event end time"
							type="time"
							min={startTime}
							value={endTime}
							onChange={(e) => handleEndTimeChange(e.target.value)}
							onKeyDown={stopCalendarNavigationKeys}
							className={twMerge(
								getTextFieldBasicStyles,
								'h-10 w-28 px-2 pt-0 text-sm'
							)}
						/>
					</div>
				</div>

				<div className="flex flex-col">
					<p className="text-muted-foreground mb-1 text-xs">Priority</p>
					<RadioGroup
						value={priority}
						onChange={(value) => setPriority(value as Priority)}
						className="my-auto flex gap-2"
						aria-label="Event priority"
					>
						<Radio
							className="group outline-none"
							value="LOW_PRIORITY"
							onKeyDown={stopCalendarNavigationKeys}
						>
							<Tag className="flex items-center gap-2 px-2 py-1 text-xs">
								<Dot state="success" size="sm" />
								<p>Low</p>
								<RadioIconVisual className="ml-auto size-3 rounded-full" />
							</Tag>
						</Radio>
						<Radio
							className="group outline-none"
							value="MEDIUM_PRIORITY"
							onKeyDown={stopCalendarNavigationKeys}
						>
							<Tag className="flex items-center gap-2 px-2 py-1 text-xs">
								<Dot state="pending" size="sm" />
								<p>Medium</p>
								<RadioIconVisual className="ml-auto size-3 rounded-full" />
							</Tag>
						</Radio>
						<Radio
							className="group outline-none"
							value="HIGH_PRIORITY"
							onKeyDown={stopCalendarNavigationKeys}
						>
							<Tag className="flex items-center gap-2 px-2 py-1 text-xs">
								<Dot state="destructive" size="sm" />
								<p>High</p>
								<RadioIconVisual className="ml-auto size-3 rounded-full" />
							</Tag>
						</Radio>
					</RadioGroup>
				</div>
			</div>

			<ResizableTextArea
				className="w-full !max-w-full"
				label="Add new event"
				textAreaProps={{
					onKeyDown: (e) => {
						// CalendarCell koristi space i enter za navigaciju, pa ih zato sprječavamo da se propagiraju u inputu kako bi ipak mogli koristiti space i enter unutar inputa
						stopCalendarNavigationKeys(e);
					},
				}}
				iconsRight={
					<Button
						variant="outline"
						colorScheme="yellow"
						type="submit"
						className="mt-4 p-2"
						size="sm"
						// isDisabled={isLoading}
						// isLoading={isLoading}
					>
						<Plus />
					</Button>
				}
			/>
		</Form>
	);
};
