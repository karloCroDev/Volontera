'use client';

// Modules
import { AddTask } from '@/modules/main/organization/tasks/add-task';
import { TaskModal } from '@/modules/main/organization/tasks/task-modal';
import { EditBoard } from '@/modules/main/organization/tasks/edit-board';
import { RetrieveAllOrganizationBoardsWithTasksResponse } from '@repo/types/organization-tasks';
import { useRetrieveAllOrganizationBoardsWithTasks } from '@/hooks/data/organization-tasks';
import { useParams } from 'next/navigation';
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { TasksBoard } from '@/modules/main/organization/tasks/tasks-board';

export const BoardsMapping: React.FC<{
	boardWithTasks: RetrieveAllOrganizationBoardsWithTasksResponse;
}> = withReactQueryProvider(({ boardWithTasks }) => {
	const params = useParams<{ organizationId: string }>();
	const { data } = useRetrieveAllOrganizationBoardsWithTasks(
		{
			organizationId: params.organizationId,
		},
		{
			initialData: boardWithTasks,
		}
	);
	return data.boards.length > 0 ? (
		data.boards.map((board) => (
			<TasksBoard
				tasks={board.organizationTasks}
				title={board.title}
				key={board.id}
			/>
		))
	) : (
		<p>No boards found.</p>
	);
});
