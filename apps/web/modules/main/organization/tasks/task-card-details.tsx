'use client';

// External packages
import * as React from 'react';
import {
	Checkbox,
	CheckboxGroup,
	Form,
	Input as AriaInput,
} from 'react-aria-components';

// Components
import { Textarea } from '@/components/ui/textarea';
import { Tag } from '@/components/ui/tag';
import { Avatar } from '@/components/ui/avatar';
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { Message } from '@/components/ui/message/message';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { CheckboxVisually } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { convertCalendarDate } from '@/lib/utils/converter';
import { DeleteConfirmationDialog } from '@/modules/main/organization/tasks/delete-confirmaton-dialog';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	UpdateTaskInfoArgs,
	updateTaskInfoSchema,
} from '@repo/schemas/organization-tasks';
import { useParams } from 'next/navigation';
import {
	useCreateTask,
	useDeleteTaskById,
	useRetrieveTaskInfo,
	useUpdateTaskInfo,
} from '@/hooks/data/organization-tasks';
import { useDeleteAccount } from '@/hooks/data/settings';
import { toast } from '@/lib/utils/toast';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { FilledInput } from '@/components/ui/filled-input';
import { Input } from '@/components/ui/input';
import { Error } from '@/components/ui/error';
import { TaskCardQuestions } from '@/modules/main/organization/tasks/task-card-questions';

export const TaskCardDetails: React.FC<{
	taskId: string;
	boardId: string;
}> = ({ taskId, boardId }) => {
	const params = useParams<{ organizationId: string }>();
	const { data } = useRetrieveTaskInfo({
		organizationId: params.organizationId,
		taskId,
	});

	const {
		control,
		handleSubmit,
		formState: { isDirty, errors },
		reset,
	} = useForm<UpdateTaskInfoArgs>({
		resolver: zodResolver(updateTaskInfoSchema),
		defaultValues: {
			description: '',
			dueDate: '',
			title: '',
			organizationId: params.organizationId,
			organizationTasksBoardId: boardId,
			taskId,
		},
	});

	React.useEffect(() => {
		if (!data || !data.taskInfo) return;
		reset({
			description: data.taskInfo.description,
			dueDate: data.taskInfo.organizationTask.dueDate,
			title: data.taskInfo.organizationTask.title,
			organizationId: params.organizationId,
			organizationTasksBoardId: boardId,
			taskId,
		});
	}, [data]);

	const { mutate: mutateUpdateTaskInfo } = useUpdateTaskInfo();

	const onSubmit = (data: UpdateTaskInfoArgs) => {
		mutateUpdateTaskInfo(data, {
			onSuccess: ({ message, title }) => {
				toast({
					title,
					content: message,
					variant: 'success',
				});
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

	const { mutate: mutateDeleteTaskById } = useDeleteTaskById(boardId);

	// Questions

	return (
		<div className="no-scrollbar flex max-h-[600px] w-full flex-col justify-between gap-4 overflow-y-scroll lg:aspect-video lg:max-h-[800px] lg:flex-row">
			<Form
				className="no-scrollbar flex flex-1 flex-col lg:overflow-y-scroll"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Controller
					control={control}
					name="title"
					render={({ field }) => (
						<AriaInput
							className="placeholder: text-lg outline-none lg:text-xl"
							placeholder="Task title"
							// size="lg"

							{...field}
						/>
					)}
				/>
				<Error>{errors.title?.message}</Error>

				<p className="text-muted-foreground mb-6 text-sm">
					Due date: {data?.taskInfo?.organizationTask.dueDate}
					{/* {specificDate} */}
				</p>

				<p className="text-md mb-2">Full description</p>

				<Controller
					control={control}
					name="description"
					render={({ field }) => (
						<Textarea
							label="Enter more information about this task"
							textAreaProps={field}
							error={errors.description?.message}
						/>
					)}
				/>

				<p className="text-md mb-2 mt-4">Set new due date</p>
				<Controller
					control={control}
					name="dueDate"
					render={({ field: { onChange, value } }) => (
						<DatePicker
							minValue={today(getLocalTimeZone())}
							value={value ? parseDate(value) : undefined}
							onChange={(val) => {
								if (!val) return;

								const formatted = convertCalendarDate(val);
								onChange(formatted);
							}}
						/>
					)}
				/>

				<p className="text-md mb-3 mt-4">All members on this task</p>

				<CheckboxGroup
					className="no-scrollbar mx-auto grid max-h-60 w-fit grid-cols-2 place-content-start gap-4 self-center overflow-y-scroll lg:max-h-full lg:grid-cols-3"
					// value={assignedMemberIds}
					// onChange={setAssignedMemberIds}
				>
					{[...Array(6)].map((_, indx) => {
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
										variant={indx === 0 ? 'success' : 'secondary'}
									/>
								</Tag>
							</Checkbox>
						);
					})}
				</CheckboxGroup>

				<div className="mt-auto flex justify-between">
					<DeleteConfirmationDialog
						action={() => {
							mutateDeleteTaskById(
								{ organizationId: params.organizationId, taskId },
								{
									onSuccess: ({ message, title }) => {
										toast({
											title,
											content: message,
											variant: 'success',
										});
									},

									onError: ({ message, title }) => {
										toast({
											title,
											content: message,
											variant: 'error',
										});
									},
								}
							);
						}}
						name={data?.taskInfo?.organizationTask.title || 'work'}
					/>
					<Button
						size="sm"
						isDisabled={!isDirty}
						isLoading={false}
						type="submit"
					>
						Save
					</Button>
				</div>
			</Form>

			<div className="bg-input-border w-px self-stretch" />
			<TaskCardQuestions taskId={taskId} />
		</div>
	);
};
