'use client';

// Modules
import { AddTaskDialog } from '@/modules/main/organization/tasks/add-task-dialog';
import { TaskModal } from '@/modules/main/organization/tasks/task-modal';
import { EditBoardDialog } from '@/modules/main/organization/tasks/edit-board-dialog';
import { RetrieveAllOrganizationBoardsWithTasksResponse } from '@repo/types/organization-tasks';
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { Dialog } from '@/components/ui/dialog';
import { TaskCardDetails } from '@/modules/main/organization/tasks/task-card-details';
import { TaskCard } from '@/modules/main/organization/tasks/task-card';
import { TasksMapping } from '@/modules/main/organization/tasks/tasks-mapping';

export const TasksBoard: React.FC<{
	id: string;
	title: string;
	tasks: React.ReactNode;
}> = withReactQueryProvider(({ id, title, tasks }) => {
	return (
		<div
			suppressHydrationWarning // TODO: FIX HYDRA
			className="border-input-border bg-muted flex min-h-[600px] w-full flex-col gap-5 rounded-xl border p-4 sm:w-2/3 lg:w-1/2 2xl:w-2/5"
		>
			<div className="flex items-center justify-between">
				<h4 className="text-lg underline underline-offset-4">{title}</h4>
				<EditBoardDialog />
			</div>

			{tasks}

			<AddTaskDialog organizationTasksBoardId={id} />
		</div>
	);
});

// <TaskModal
// 	cardProps={{
// 		title: 'Save the earth',
// 		description: 'Save the earth from xxxxxx',
// 		indefiniteDate: `${new Date().toLocaleString('default', { month: 'long' }).slice(0, 3)} ${new Date().getDate()}`,
// 		isUserIncluded: true,
// 		otherUsersCount: 3,
// 		state: 'success',
// 	}}
// 	specificDate={new Date().toLocaleDateString().replaceAll('/', '. ')}
// />;
