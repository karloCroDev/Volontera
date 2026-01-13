'use client';

// External packages
import * as React from 'react';
import { RetrieveAllOrganizationBoardsWithTasksResponse } from '@repo/types/organization-tasks';
import { Dialog } from '@/components/ui/dialog';
import { TaskCard } from '@/modules/main/organization/tasks/task-card';
import { TaskCardDetails } from '@/modules/main/organization/tasks/task-card-details';

export const TasksMapping: React.FC<{
	tasks?: RetrieveAllOrganizationBoardsWithTasksResponse['boards'][0]['organizationTasks'];
}> = ({ tasks }) => {
	return (
		<div className="no-scrollbar flex flex-1 flex-col gap-4">
			{tasks && tasks.length > 0 ? (
				tasks.map((task) => (
					<Dialog
						key={task.id}
						// title={cardProps.title}
						// subtitle={`Due date: ${specificDate}`}
						triggerChildren={<TaskCard task={task} />}
						startDesktop={2}
						endDesktop={12}
					>
						<TaskCardDetails />
					</Dialog>
				))
			) : (
				<div className="flex flex-1 items-center justify-center">
					<p className="text-muted-foreground jkus text-center">
						No tasks found.
					</p>
				</div>
			)}
		</div>
	);
};
