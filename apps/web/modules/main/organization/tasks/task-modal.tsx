'use client';

// External packages
import * as React from 'react';

// Components
import { Dialog } from '@/components/ui/dialog';
import {
	TaskCard,
	TaskCardProps,
} from '@/modules/main/organization/tasks/task-card';
import { Form } from 'react-aria-components';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tag } from '@/components/ui/tag';
import { Avatar } from '@/components/ui/avatar';

export const TaskModal: React.FC<{
	cardProps: TaskCardProps;
}> = ({ cardProps }) => {
	return (
		<Dialog
			title={cardProps.title}
			subtitle={`Due date: ${cardProps.date.toLocaleDateString().replaceAll('/', '.')}`}
			triggerChildren={
				<TaskCard
					title={cardProps.title}
					description={cardProps.description}
					date={cardProps.date}
					state={cardProps.state}
					isUserIncluded={cardProps.isUserIncluded}
					otherUsersCount={cardProps.otherUsersCount}
				/>
			}
		>
			<p className="text-md mb-2">Description</p>
			<Textarea label="Enter more information about this task" />
			<p className="text-md mb-2 mt-4">All users on this task</p>

			<div className="grid grid-cols-4 gap-4">
				{[...Array(9)].map((_, indx) => (
					<Tag className="flex items-center gap-4" key={indx}>
						<Avatar
							imageProps={{
								src: '',
							}}
							size="xs"
						>
							Ante
						</Avatar>
						<p>Ante</p>
					</Tag>
				))}
			</div>
		</Dialog>
	);
};
