'use client';

// External packages
import * as React from 'react';
import { Checkbox, CheckboxGroup, Form } from 'react-aria-components';

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
import { DeleteConfirmation } from '@/modules/main/organization/tasks/delete-confirmaton';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	createTaskSchema,
	CreateTaskArgs,
} from '@repo/schemas/organization-tasks';
import { useParams } from 'next/navigation';
import { useCreateTask } from '@/hooks/data/organization-tasks';

export const TaskCardDetails = () => {
	return (
		<div className="no-scrollbar flex max-h-[600px] w-full flex-col justify-between gap-4 overflow-y-scroll lg:aspect-video lg:max-h-[800px] lg:flex-row">
			<Form
				className="no-scrollbar flex flex-1 flex-col lg:overflow-y-scroll"
				// onSubmit={handleSubmit(onSubmit)}
			>
				<h4 className="text-lg lg:text-xl" slot="title">
					{/* {cardProps.title} */}
				</h4>

				<p className="text-muted-foreground mb-6 text-sm">
					Due date:
					{/* {specificDate} */}
				</p>

				<p className="text-md mb-2">Full description</p>

				{/* <Controller
					control={control}
					name="dueDate"
					render={({ field }) => ( */}
				<Textarea
					label="Enter more information about this task"
					// textAreaProps={field}
				/>
				{/* )}
				/> */}
				<p className="text-md mb-2 mt-4">Set new due date</p>

				{/* <Controller
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
				/> */}

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
					<DeleteConfirmation
						action={() => console.log('Wohohoho')}
						id=""
						name="Woah"
					/>
					<Button size="sm">Save</Button>
				</div>
			</Form>

			<div className="bg-input-border w-px self-stretch" />

			<div className="relative flex flex-1 flex-col gap-4">
				<h4 className="mb-4 text-lg underline underline-offset-4 lg:text-xl">
					Questions
				</h4>

				<div className="no-scrollbar max-h-[600px] min-h-60 flex-1 overflow-y-scroll lg:max-h-full">
					{[...Array(5)].map((_, indx) => (
						<Message
							key={indx}
							variant={indx === 0 ? 'primary' : 'secondary'}
							className={indx !== 0 ? 'mt-4' : undefined}
							date={new Date()}
							avatar={<Avatar imageProps={{ src: '' }}>Ante</Avatar>}
						>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit.
						</Message>
					))}
				</div>

				<ResizableTextArea
					className="bg-muted absolute bottom-0 w-full lg:max-w-full"
					label="Enter your questions"
					iconsRight={
						<Button
							type="submit"
							className="p-2"
							// isDisabled={!isDirty}
							// isLoading={false}
						>
							<Send />
						</Button>
					}
				/>
			</div>
		</div>
	);
};
