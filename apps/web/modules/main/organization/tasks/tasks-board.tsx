'use client';

/* eslint react/prop-types: 0 */

// Modules
import { AddTaskDialog } from '@/modules/main/organization/tasks/add-task-dialog';
import { EditBoardDialog } from '@/modules/main/organization/tasks/edit-board-dialog';

// Modules
import { AddTaskAiDialog } from '@/modules/main/organization/tasks/add-task-ai-dialog';

// Components
import { Container } from '@/components/ui/container';

export const TasksBoard: React.FC<{
	boardId: string;
	title: string;
	tasks: React.ReactNode;
	canMoveTasks: boolean;
}> = ({ boardId, title, tasks, canMoveTasks }) => {
	return (
		<Container className="flex min-h-[600px] w-full min-w-96 flex-col gap-5 rounded-xl p-4 shadow-xl sm:w-2/3 lg:w-1/2 2xl:w-2/5">
			<div className="flex items-center justify-between">
				<h4 className="text-lg underline underline-offset-4">{title}</h4>
				<EditBoardDialog boardId={boardId} title={title} />
			</div>

			{tasks}

			<div className="flex gap-4">
				{canMoveTasks && (
					<>
						<AddTaskDialog organizationTasksBoardId={boardId} />
						<AddTaskAiDialog organizationTasksBoardId={boardId} />
					</>
				)}
			</div>
		</Container>
	);
};
