// Modules
import { AddBoardDialog } from '@/modules/main/organization/tasks/add-board-dialog';
import { TasksBoardSkeleton } from '@/modules/main/organization/tasks/task-skeleton';

// Lib
import { retrieveAllOrganizationBoardsWithTasks } from '@/lib/server/organization-tasks';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BoardsMapping } from '@/modules/main/organization/tasks/boards-mapping';
import { SortTasksSelect } from '@/modules/main/organization/tasks/sort-tasks-select';
import { retrieveOrganizationMember } from '@/lib/server/organization-managment';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { hasWantedOrganizationRole } from '@repo/permissons/index';

export default async function BoardPage({
	params,
	searchParams,
}: {
	params: Promise<{ organizationId: string }>;
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const { organizationId } = await params;
	const searchParamsResolved = await searchParams;

	const member = await retrieveOrganizationMember(organizationId);

	if (!member.success) return; // Handling in layout

	return (
		<div className="flex flex-1 flex-col">
			<div className="mb-6 flex flex-col justify-between gap-x-8 gap-y-4 overflow-x-scroll lg:flex-row lg:items-center">
				<div>
					<h4 className="text-xl lg:text-2xl">Tasks</h4>

					<p className="text-muted-foreground">
						All tasks that are assigned inside this organization
					</p>
				</div>
				<div className="flex justify-between gap-4 lg:justify-start">
					<SortTasksSelect />
					{hasWantedOrganizationRole({
						userRole: member.organizationMember.role,
						requiredRoles: ['ADMIN'],
						ownerHasAllAccess: true,
					}) && <AddBoardDialog />}
				</div>
			</div>
			<div className="flex min-h-0 flex-1 gap-4 overflow-scroll">
				<Suspense
					fallback={[...Array(3)].map((_, indx) => (
						<TasksBoardSkeleton key={indx} />
					))}
				>
					<BoardsWithTasks
						organizationId={organizationId}
						filter={searchParamsResolved.filter}
					/>
				</Suspense>
			</div>
		</div>
	);
}

async function BoardsWithTasks({
	organizationId,
	filter,
}: {
	organizationId: string;
	filter?: string;
}) {
	const boardWithTasks = await retrieveAllOrganizationBoardsWithTasks(
		organizationId,
		filter
	);
	if (!boardWithTasks.success) notFound();

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: [organizationId, 'organization-boards'],
		queryFn: async () => ({
			boards: boardWithTasks.boardsWithTasks,
			success: boardWithTasks.success,
			message: boardWithTasks.message,
		}),
	});

	await Promise.all(
		boardWithTasks.boardsWithTasks.map((board) =>
			queryClient.prefetchQuery({
				queryKey: [board.id, 'organization-tasks', filter ?? null],
				queryFn: async () => ({
					tasks: board.organizationTasks,
					success: true,
					message: 'Prefetched data',
				}),
			})
		)
	);

	const dehydratedState = dehydrate(queryClient);
	return <BoardsMapping dehydratedState={dehydratedState} />;
}
