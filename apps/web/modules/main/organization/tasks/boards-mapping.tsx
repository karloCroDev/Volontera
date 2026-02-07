'use client';

// External packages
import { useParams } from 'next/navigation';

// Modules
import { TasksBoard } from '@/modules/main/organization/tasks/tasks-board';
import { TasksMapping } from '@/modules/main/organization/tasks/tasks-mapping';

// Hooks
import { useRetrieveAllOrganizationBoards } from '@/hooks/data/organization-tasks';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const BoardsMapping = withReactQueryProvider(() => {
	const params = useParams<{ organizationId: string }>();
	const { data } = useRetrieveAllOrganizationBoards(
		{
			organizationId: params.organizationId,
		},
		{}
	);
	return data.boards.length > 0 ? (
		data.boards.map((board) => (
			<TasksBoard
				tasks={<TasksMapping boardId={board.id} />}
				boardId={board.id}
				title={board.title}
				key={board.id}
			/>
		))
	) : (
		<p className="text-muted-foreground mx-auto w-fit">No boards found.</p>
	);
});
