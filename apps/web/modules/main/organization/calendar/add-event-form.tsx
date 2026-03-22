'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Input as AriaInput,
	Form,
	Radio,
	RadioGroup,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { Controller, useForm } from 'react-hook-form';
import { CalendarDate } from '@internationalized/date';
import { z } from 'zod';

// Components
import { Button } from '@/components/ui/button';
import { getTextFieldBasicStyles } from '@/components/ui/input';
import { Tag } from '@/components/ui/tag';
import { Dot } from '@/components/ui/dot';
import { RadioIconVisual } from '@/components/ui/radio';
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { Error } from '@/components/ui/error';

// Hooks
import { useCreateOrganizationEvent } from '@/hooks/data/organization-calendar';

// Schemas
import { createOrganizationEventBaseSchema } from '@repo/schemas/organization-calendar';

// Lib
import { toast } from '@/lib/utils/toast';
import { useParams } from 'next/navigation';

const addEventFormSchema = createOrganizationEventBaseSchema.pick({
	content: true,
	status: true,
});

type AddEventFormValues = z.infer<typeof addEventFormSchema>;

function combineDateAndTime(date: CalendarDate, timeStr: string): Date {
	const parts = timeStr.split(':');
	const hours = Number(parts[0]);
	const minutes = Number(parts[1]);
	return new Date(date.year, date.month - 1, date.day, hours, minutes, 0, 0);
}

function toLocalNoon(date: CalendarDate): Date {
	return new Date(date.year, date.month - 1, date.day, 12, 0, 0, 0);
}

export const AddEventForm: React.FC<{
	calendarId: string;
	date: CalendarDate;
}> = ({ calendarId, date }) => {
	const params = useParams<{ organizationId: string }>();
	const [startTime, setStartTime] = React.useState<string>('09:00');
	const [endTime, setEndTime] = React.useState<string>('10:00');

	const { mutate, isPending } = useCreateOrganizationEvent();

	const {
		control,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm<AddEventFormValues>({
		resolver: zodResolver(addEventFormSchema),
		defaultValues: {
			content: '',
			status: 'MEDIUM_PRIORITY',
		},
	});

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

	const onSubmit = ({ content, status }: AddEventFormValues) => {
		mutate(
			{
				content,
				status,
				organizationId: params.organizationId,
				calendarId,
				date: toLocalNoon(date),
				startTime: combineDateAndTime(date, startTime),
				endTime: combineDateAndTime(date, endTime),
			},
			{
				onSuccess({ title, message }) {
					toast({ title, content: message, variant: 'success' });
					reset();
					setStartTime('09:00');
					setEndTime('10:00');
				},
				onError(err) {
					console.log(err.message);
					setError('root', { type: 'server', message: err.message });
				},
			}
		);
	};

	console.log(errors);
	return (
		<Form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
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
					<Controller
						control={control}
						name="status"
						render={({ field }) => (
							<RadioGroup
								value={field.value}
								onChange={field.onChange}
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
						)}
					/>
				</div>
			</div>

			<Controller
				control={control}
				name="content"
				render={({ field }) => (
					<ResizableTextArea
						className="w-full !max-w-full"
						label="Add new event"
						error={errors.content?.message}
						textAreaProps={{
							...field,
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
								isDisabled={isPending}
								isLoading={isPending}
							>
								<Plus />
							</Button>
						}
					/>
				)}
			/>
			{errors.root?.message && <Error>{errors.root.message}</Error>}
		</Form>
	);
};
