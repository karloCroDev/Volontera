'use client';

// External packages
import * as React from 'react';
import { RetrieveAllOrganizationBoardsWithTasksResponse } from '@repo/types/organization-tasks';
import { Dialog } from '@/components/ui/dialog';
import { TaskCard } from '@/modules/main/organization/tasks/task-card';
import { TaskCardDetails } from '@/modules/main/organization/tasks/task-card-details';
import { useRetrieveAllBoardTasksArgs } from '@/hooks/data/organization-tasks';
import { useParams } from 'next/navigation';

export const TasksMapping: React.FC<{
	tasks: RetrieveAllOrganizationBoardsWithTasksResponse['boardsWithTasks'][0]['organizationTasks'];
	boardId: string;
}> = ({ tasks, boardId }) => {
	const params = useParams<{ organizationId: string }>();
	const { data } = useRetrieveAllBoardTasksArgs(
		{
			organizationId: params.organizationId,
			organizationTaskBoardId: boardId,
		},
		{
			initialData: {
				tasks,
				success: true,
				message: 'Prefetched data',
			},
		}
	);
	return (
		<div className="no-scrollbar flex flex-1 flex-col gap-4">
			{data && data.tasks.length > 0 ? (
				data.tasks.map((task) => (
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
