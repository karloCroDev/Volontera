'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';
import {
	Button as AriaButton,
	CalendarCellProps,
	Input as AriaInput,
	Form,
	Radio,
	RadioGroup,
} from 'react-aria-components';
import { CalendarCell, Tooltip, TooltipTrigger } from 'react-aria-components';
import { twJoin, twMerge } from 'tailwind-merge';

// Components
import { Dialog } from '@/components/ui/dialog';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { getTextFieldBasicStyles } from '@/components/ui/input';
import { Tag } from '@/components/ui/tag';
import { Dot } from '@/components/ui/dot';
import { RadioIconVisual } from '@/components/ui/radio';

// Lib
import { formatDate } from '@/lib/utils/time-adjustments';
import { ResizableTextArea } from '@/components/ui/resizable-input';

// TODO: Change this once I get from prisma for the sake of consistency
type Priority = 'LOW_PRIORITY' | 'MEDIUM_PRIORITY' | 'HIGH_PRIORITY';

export const EventDialog: React.FC<{
	date: CalendarCellProps['date'];
}> = ({ date }) => {
	const [priority, setPriority] = React.useState<Priority>('MEDIUM_PRIORITY');
	const [time, setTime] = React.useState<string>('09:00');

	const stopCalendarNavigationKeys = (e: React.KeyboardEvent) => {
		// CalendarCell koristi za accessibilty Space/Enter, pa ovo je da prestanemo sa propagacijom na druge elemente
		if (e.key === ' ' || e.key === 'Enter') {
			e.stopPropagation();
		}
	};

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
			// Vrati iso format datuma, te nije problem formatirati ga kao string za date objekt
			title={`Events on: ${formatDate(date.toString())}`}
			subtitle="All events based on the given date"
		>
			<div>
				<div className="my-4 flex max-h-60 flex-col gap-3 overflow-y-scroll">
					{[...Array(8)].map((_, indx) => (
						<div
							className="border-input-border relative flex items-center justify-between rounded border px-4 py-3"
							key={indx}
						>
							<TooltipTrigger delay={500}>
								<Tooltip>
									<Container className="rounded-md p-2">Low priority</Container>
								</Tooltip>
								<AriaButton className="bg-success absolute left-1 h-[calc(100%-0.5rem)] w-1.5 cursor-help rounded-full" />
							</TooltipTrigger>
							<p>Task xxx</p>
							<div className="flex items-center gap-2 text-sm">
								<p className="text-muted-foreground">Time:</p>
								<p className="italic">{formatDate(date.toString())}</p>
							</div>
						</div>
					))}
				</div>

				<hr className="bg-input-border my-6 h-px w-full border-0" />

				<Form className="flex flex-col gap-2">
					<div className="flex flex-col md:flex-row md:justify-between">
						<div>
							<p className="text-muted-foreground mb-1 text-xs">Time</p>
							<AriaInput
								aria-label="Event time"
								type="time"
								value={time}
								onChange={(e) => setTime(e.target.value)}
								onKeyDown={stopCalendarNavigationKeys}
								className={twMerge(
									getTextFieldBasicStyles,
									'h-10 w-28 px-2 pt-0 text-sm'
								)}
							/>
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
			</div>
		</Dialog>
	);
};
