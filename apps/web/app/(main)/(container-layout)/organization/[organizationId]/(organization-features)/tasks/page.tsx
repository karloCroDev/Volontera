// Modules
import { AddBoard } from '@/modules/main/organization/tasks/add-board';
import { TasksBoardSkeleton } from '@/modules/main/organization/tasks/task-skeleton';

// Lib
import { retrieveAllOrganizationBoardsWithTasks } from '@/lib/server/organization-tasks';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BoardsMapping } from '@/modules/main/organization/tasks/boards-mapping';

export default async function BoardPage({
	params,
}: {
	params: Promise<{ organizationId: string }>;
}) {
	const { organizationId } = await params;
	const boards = await retrieveAllOrganizationBoardsWithTasks(organizationId);

	console.log(boards);
	return (
		<div className="flex flex-1 flex-col">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h4 className="text-xl lg:text-2xl">Tasks</h4>
					<p className="text-muted-foreground">
						All tasks that are assigned inside this organization
					</p>
				</div>
				<AddBoard />
			</div>
			<div className="flex min-h-0 flex-1 gap-4 overflow-scroll">
				<Suspense
					fallback={[...Array(2)].map((_, indx) => (
						<TasksBoardSkeleton key={indx} />
					))}
				>
					<BoardsWithTasks organizationId={organizationId} />
				</Suspense>
			</div>
		</div>
	);
}

async function BoardsWithTasks({ organizationId }: { organizationId: string }) {
	const boardWithTasks =
		await retrieveAllOrganizationBoardsWithTasks(organizationId);
	if (!boardWithTasks.success) notFound();

	return <BoardsMapping boardWithTasks={boardWithTasks} />;
}
