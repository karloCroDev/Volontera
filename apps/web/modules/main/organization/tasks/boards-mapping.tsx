'use client';

// External packages
import { useParams } from 'next/navigation';

// Modules
import { TasksBoard } from '@/modules/main/organization/tasks/tasks-board';
import { TasksMapping } from '@/modules/main/organization/tasks/tasks-mapping';

// Types
import { RetrieveAllOrganizationBoardsWithTasksResponse } from '@repo/types/organization-tasks';

// Hooks
import { useRetrieveAllOrganizationBoardsWithTasks } from '@/hooks/data/organization-tasks';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

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
				tasks={<TasksMapping tasks={board.organizationTasks} />}
				title={board.title}
				key={board.id}
			/>
		))
	) : (
		<p>No boards found.</p>
	);
});
