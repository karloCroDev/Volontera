'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox, CheckboxGroup, Form } from 'react-aria-components';
import { DatePicker } from '@/components/ui/date-picker';
import { Tag } from '@/components/ui/tag';
import { Avatar } from '@/components/ui/avatar';
import { CheckboxVisually } from '@/components/ui/checkbox';
import { convertCalendarDate } from '@/lib/utils/converter';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import {
	CreateTaskArgs,
	createTaskSchema,
} from '@repo/schemas/organization-tasks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTask } from '@/hooks/data/organization-tasks';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/lib/utils/toast';
import { Error } from '@/components/ui/error';

export const AddTaskDialog: React.FC<{
	organizationTasksBoardId: string;
}> = ({ organizationTasksBoardId }) => {
	const [assignedMemberIds, setAssignedMemberIds] = React.useState<string[]>([
		'0',
	]);

	const [isOpen, setIsOpen] = React.useState(false);
	const params = useParams<{ organizationId: string }>();
	const {
		handleSubmit,
		control,
		formState: { errors, isDirty },
		reset,
		watch,
	} = useForm<CreateTaskArgs>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			organizationTasksBoardId,
			organizationId: params.organizationId,
			title: '',
			description: '',
			dueDate: '',
		},
	});

	const { mutate, isPending } = useCreateTask();
	const onSubmit = (data: CreateTaskArgs) => {
		mutate(data, {
			onSuccess: ({ message, title }) => {
				toast({
					title,
					content: message,
					variant: 'success',
				});

				reset();
				setIsOpen(false);
			},
			onError: ({ message, title }) => {
				toast({
					title,
					content: message,
					variant: 'error',
				});
			},
		});
	};

	console.log(watch().dueDate);
	return (
		<Dialog
			onOpenChange={setIsOpen}
			isOpen={isOpen}
			title="Add new task"
			subtitle="Please enter the information about your organization inside these fields"
			triggerChildren={
				<Button
					isFullyRounded
					variant="outline"
					type="button"
					iconRight={<Plus />}
				>
					Add Task
				</Button>
			}
		>
			<Form
				className="flex flex-col gap-4 overflow-y-scroll"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div>
					<Label className="mb-2">Title</Label>
					<Controller
						control={control}
						name="title"
						render={({ field }) => (
							<Input
								label="Enter your board title"
								inputProps={field}
								error={errors.title?.message}
							/>
						)}
					/>
				</div>
				<div>
					<Label className="mb-2">Description</Label>

					<Controller
						control={control}
						name="description"
						render={({ field }) => (
							<Textarea
								label="Enter your task description"
								textAreaProps={field}
								error={errors.description?.message}
							/>
						)}
					/>
				</div>
				<div>
					<Label className="mb-2">Due date</Label>

					<Controller
						control={control}
						name="dueDate"
						render={({ field: { onChange } }) => (
							<DatePicker
								onChange={(val) => {
									if (!val) return;

									const formatted = convertCalendarDate(val);
									onChange(formatted);
								}}
							/>
						)}
					/>

					<Error>{errors.dueDate?.message}</Error>
				</div>

				{/* TODO: Handle if there is some more time */}
				{/* <div className="w-full">
					<Label className="mb-2">Assgin members</Label>

					<CheckboxGroup
						value={assignedMemberIds}
						onChange={setAssignedMemberIds}
						className="mx-auto flex w-fit flex-wrap gap-3"
					>
						{[...Array(4)].map((_, indx) => {
							return (
								<Checkbox className="group" key={indx} value={indx.toString()}>
									<Tag className="flex items-center gap-4">
										<Avatar
											imageProps={{
												src: '',
											}}
											size="xs"
										>
											Ante
										</Avatar>
										<p>Ante</p>

										<CheckboxVisually
											className="rounded-full"
											variant="secondary"
										/>
									</Tag>
								</Checkbox>
							);
						})}
					</CheckboxGroup>
				</div> */}

				<Button
					type="submit"
					className="self-end"
					size="md"
					isDisabled={!isDirty || isPending}
					isLoading={isPending}
				>
					Submit
				</Button>
			</Form>
		</Dialog>
	);
};
