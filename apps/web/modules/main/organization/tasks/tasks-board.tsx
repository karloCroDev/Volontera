'use client';

// Modules
import { AddTask } from '@/modules/main/organization/tasks/add-task';
import { TaskModal } from '@/modules/main/organization/tasks/task-modal';
import { EditBoard } from '@/modules/main/organization/tasks/edit-board';
import { RetrieveAllOrganizationBoardsWithTasksResponse } from '@repo/types/organization-tasks';
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const TasksBoard: React.FC<{
	title: string;
	tasks?: RetrieveAllOrganizationBoardsWithTasksResponse['boards'][0]['organizationTasks'];
}> = withReactQueryProvider(({ title, tasks }) => {
	return (
		<div className="border-input-border bg-muted flex min-h-[600px] w-full flex-col gap-5 rounded-xl border p-4 sm:w-2/3 lg:w-1/2 2xl:w-2/5">
			<div className="flex items-center justify-between">
				<h4 className="text-lg underline underline-offset-4">{title}</h4>
				<EditBoard />
			</div>

			<div className="no-scrollbar flex flex-1 flex-col gap-4">
				{tasks && tasks.length > 0 ? (
					<TaskModal
						cardProps={{
							title: 'Save the earth',
							description: 'Save the earth from xxxxxx',
							indefiniteDate: `${new Date().toLocaleString('default', { month: 'long' }).slice(0, 3)} ${new Date().getDate()}`,
							isUserIncluded: true,
							otherUsersCount: 3,
							state: 'success',
						}}
						specificDate={new Date().toLocaleDateString().replaceAll('/', '. ')}
					/>
				) : (
					<div className="flex flex-1 items-center justify-center">
						<p className="text-muted-foreground jkus text-center">
							No tasks found.
						</p>
					</div>
				)}
			</div>

			<AddTask />
		</div>
	);
});
