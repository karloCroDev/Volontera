'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLocalTimeZone, today } from '@internationalized/date';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
	Checkbox,
	CheckboxGroup,
	Form,
	Radio,
	RadioGroup,
} from 'react-aria-components';
import { DatePicker } from '@/components/ui/date-picker';
import { Tag } from '@/components/ui/tag';
import { Avatar } from '@/components/ui/avatar';
import { CheckboxVisually } from '@/components/ui/checkbox';
import { convertCalendarDate, convertToFullname } from '@/lib/utils/converter';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

// Hooks
import {
	useCreateTask,
	useRetrieveOrganizationMembers,
} from '@/hooks/data/organization-tasks';
import { Textarea } from '@/components/ui/textarea';
import { Error } from '@/components/ui/error';
import { Dot } from '@/components/ui/dot';
import { RadioIconVisual } from '@/components/ui/radio';

// Lib
import { toast } from '@/lib/utils/toast';

// Schemas
import {
	CreateTaskArgs,
	createTaskSchema,
} from '@repo/schemas/organization-tasks';

export const AddTaskDialog: React.FC<{
	organizationTasksBoardId: string;
}> = ({ organizationTasksBoardId }) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const params = useParams<{ organizationId: string }>();
	const { data: organizationMembersData } = useRetrieveOrganizationMembers({
		organizationId: params.organizationId,
	});
	const {
		handleSubmit,
		control,
		formState: { errors, isDirty },
		reset,
	} = useForm<CreateTaskArgs>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			organizationTasksBoardId,
			organizationId: params.organizationId,
			title: '',
			description: '',
			dueDate: '',
			assignedMembers: [],
			priority: 'MEDIUM_PRIORITY',
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

				reset({
					description: '',
					title: '',
					dueDate: '',
					assignedMembers: [],
				});
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

	return (
		<Dialog
			onOpenChange={setIsOpen}
			isOpen={isOpen}
			title="Add new task"
			subtitle="Please enter the information about the new task"
			dialogProps={{
				className: 'max-h-[600px] overflow-y-scroll',
			}}
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
								minValue={today(getLocalTimeZone())}
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

				<div className="w-full">
					<Label className="mb-2">Priority</Label>
					<Controller
						control={control}
						name="priority"
						render={({ field }) => (
							<RadioGroup
								value={field.value}
								onChange={field.onChange}
								className="flex w-fit flex-wrap gap-3"
							>
								<Radio className="group" value="LOW_PRIORITY">
									<Tag className="flex items-center gap-4">
										<Dot state="success" />
										<p>Low Priority</p>

										<RadioIconVisual className="rounded-full" />
									</Tag>
								</Radio>
								<Radio className="group" value="MEDIUM_PRIORITY">
									<Tag className="flex items-center gap-4">
										<Dot state="pending" />
										<p>Medium Priority</p>

										<RadioIconVisual className="rounded-full" />
									</Tag>
								</Radio>
								<Radio className="group" value="HIGH_PRIORITY">
									<Tag className="flex items-center gap-4">
										<Dot state="destructive" />
										<p>High Priority</p>

										<RadioIconVisual className="rounded-full" />
									</Tag>
								</Radio>
							</RadioGroup>
						)}
					/>

					<Error>{errors.priority?.message}</Error>
				</div>

				<div className="w-full">
					<Label className="mb-2">Assgin members</Label>
					<Controller
						control={control}
						name="assignedMembers"
						render={({ field }) => (
							<CheckboxGroup
								value={field.value}
								onChange={field.onChange}
								className="flex w-fit flex-wrap gap-3"
							>
								{organizationMembersData?.organizationMembers?.map((member) => (
									<Checkbox className="group" key={member.id} value={member.id}>
										<Tag className="flex items-center gap-4">
											<Avatar
												imageProps={{
													src: member.user.image
														? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${member.user.image}`
														: undefined,
												}}
												size="xs"
												isVerified={member.user.subscriptionTier === 'PRO'}
											>
												{convertToFullname({
													firstname: member.user.firstName,
													lastname: member.user.lastName,
												})}
											</Avatar>
											<p>
												{convertToFullname({
													firstname: member.user.firstName,
													lastname: member.user.lastName,
												})}
											</p>

											<CheckboxVisually
												className="rounded-full"
												variant="secondary"
											/>
										</Tag>
									</Checkbox>
								))}
							</CheckboxGroup>
						)}
					/>

					<Error>{errors.assignedMembers?.message}</Error>
				</div>

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
