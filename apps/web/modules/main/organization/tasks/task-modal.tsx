'use client';

// External packages
import * as React from 'react';
import { Checkbox, CheckboxGroup, Form } from 'react-aria-components';

// Components
import { Dialog } from '@/components/ui/dialog';
import {
	TaskCard,
	TaskCardProps,
} from '@/modules/main/organization/tasks/task-card';
import { Textarea } from '@/components/ui/textarea';
import { Tag } from '@/components/ui/tag';
import { Avatar } from '@/components/ui/avatar';
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { Message } from '@/components/ui/message';
import { Button } from '@/components/ui/button';
import { Pen, Send, Trash2 } from 'lucide-react';
import { CheckboxVisually } from '@/components/ui/checkbox';

export const TaskModal: React.FC<{
	cardProps: TaskCardProps;
	specificDate: string;
}> = ({ cardProps, specificDate }) => {
	const [assignedMemberIds, setAssignedMemberIds] = React.useState<string[]>([
		'0',
	]);
	return (
		<Dialog
			// title={cardProps.title}
			// subtitle={`Due date: ${specificDate}`}
			triggerChildren={<TaskCard {...cardProps} />}
			startDesktop={2}
			endDesktop={12}
		>
			<div className="no-scrollbar flex max-h-[600px] w-full flex-col justify-between gap-4 overflow-y-scroll lg:aspect-video lg:flex-row">
				<div className="flex flex-1 flex-col">
					<h4 className="text-lg lg:text-xl" slot="title">
						{cardProps.title}
					</h4>

					<p className="text-muted-foreground mb-6 text-sm">
						Due date: {specificDate}
					</p>

					<p className="text-md mb-2">Description</p>
					<Textarea label="Enter more information about this task" />
					<p className="text-md mb-3 mt-4">All members on this task</p>

					<CheckboxGroup
						className="no-scrollbar lg:max-h-auto mx-auto grid max-h-60 w-fit grid-cols-2 gap-4 self-center overflow-y-scroll lg:grid-cols-3"
						value={assignedMemberIds}
						onChange={setAssignedMemberIds}
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
					<Button className="ml-auto mt-4">Save</Button>
				</div>

				<div className="bg-input-border w-px self-stretch" />

				<div className="flex h-full flex-1 flex-col gap-4">
					<h4 className="text-lg lg:text-xl">Questions</h4>

					<div className="no-scrollbar lg:max-h-auto max-h-60 flex-1 overflow-y-scroll">
						{[...Array(5)].map((_, indx) => (
							<div key={indx} className="flex items-end gap-2">
								<Message
									variant={indx === 0 ? 'primary' : 'secondary'}
									className={indx !== 0 ? 'mt-4' : undefined}
									date="16:36 | 8.4. 2024"
									avatar={<Avatar imageProps={{ src: '' }}>Ante</Avatar>}
								>
									Lorem ipsum dolor sit amet, consectetur adipisicing elit.
								</Message>

								{indx === 0 && (
									<>
										<Button
											size="xs"
											className="flex-shrink-0 p-2"
											variant="outline"
											colorScheme="yellow"
										>
											<Pen />
										</Button>
										<Button
											size="xs"
											className="flex-shrink-0 p-2"
											variant="outline"
											colorScheme="destructive"
										>
											<Trash2 />
										</Button>
									</>
								)}
							</div>
						))}
					</div>

					<ResizableTextArea
						className="w-full lg:max-w-full"
						label="Enter your questions"
						iconsRight={
							<Button type="submit" className="p-2">
								<Send />
							</Button>
						}
					/>
				</div>
			</div>
		</Dialog>
	);
};
