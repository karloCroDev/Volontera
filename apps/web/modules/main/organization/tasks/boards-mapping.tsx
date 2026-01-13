'use client';

// External packages
import { useParams } from 'next/navigation';

// Modules
import { TasksBoard } from '@/modules/main/organization/tasks/tasks-board';
import { TasksMapping } from '@/modules/main/organization/tasks/tasks-mapping';

// Types
import { RetrieveAllOrganizationBoardsWithTasksResponse } from '@repo/types/organization-tasks';

// Hooks
import { useRetrieveAllOrganizationBoards } from '@/hooks/data/organization-tasks';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const BoardsMapping: React.FC<{
	prefetchedData: RetrieveAllOrganizationBoardsWithTasksResponse;
}> = withReactQueryProvider(({ prefetchedData }) => {
	const params = useParams<{ organizationId: string }>();
	const { data } = useRetrieveAllOrganizationBoards(
		{
			organizationId: params.organizationId,
		},
		{
			initialData: {
				boards: prefetchedData.boardsWithTasks,
				success: prefetchedData.success,
				message: prefetchedData.message,
			},
		}
	);
	return data.boards.length > 0 ? (
		data.boards.map((board) => (
			<TasksBoard
				tasks={
					<TasksMapping
						boardId={board.id}
						// TODO: Rn works, but find a cleaner way to handle this!!
						tasks={
							prefetchedData.boardsWithTasks.find((x) => x.id === board.id)
								?.organizationTasks || []
						}
					/>
				}
				id={board.id}
				title={board.title}
				key={board.id}
			/>
		))
	) : (
		<p className="text-muted-foreground text-center">No boards found.</p>
	);
});
