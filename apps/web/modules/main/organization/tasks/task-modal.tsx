'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';

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

export const TaskModal: React.FC<{
	cardProps: TaskCardProps;
	specificDate: string;
}> = ({ cardProps, specificDate }) => {
	return (
		<Dialog
			// title={cardProps.title}
			// subtitle={`Due date: ${specificDate}`}
			triggerChildren={<TaskCard {...cardProps} />}
			startDesktop={2}
			endDesktop={12}
		>
			<div className="flex justify-between gap-4 lg:aspect-video">
				<div className="flex flex-1 flex-col">
					<h4 className="text-lg lg:text-xl" slot="title">
						{cardProps.title}
					</h4>

					<p className="text-muted-foreground mb-6 text-sm">
						Due date: {specificDate}
					</p>

					<p className="text-md mb-2">Description</p>
					<Textarea label="Enter more information about this task" />
					<p className="text-md mb-2 mt-4">All members on this task</p>

					<div className="no-scrollbar grid grid-cols-3 gap-4 overflow-scroll xl:grid-cols-4">
						{[...Array(1)].map((_, indx) => (
							<Tag className="flex items-center gap-4" key={indx}>
								<Avatar
									imageProps={{
										src: '',
									}}
									size="xs"
								>
									Ante
								</Avatar>
								Ante
							</Tag>
						))}
					</div>
				</div>

				<div className="bg-input-border w-px self-stretch" />

				<div className="flex h-full flex-1 flex-col gap-4">
					<h4 className="text-lg lg:text-xl">Questions</h4>

					<div className="no-scrollbar flex-1 overflow-y-scroll">
						{[...Array(3)].map((_, indx) => (
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
