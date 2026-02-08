'use client';

// External packages
import { useParams } from 'next/navigation';

// Modules
import { AddTaskDialog } from '@/modules/main/organization/tasks/add-task-dialog';
import { EditBoardDialog } from '@/modules/main/organization/tasks/edit-board-dialog';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

// Modules
import { AddTaskAiDialog } from '@/modules/main/organization/tasks/add-task-ai-dialog';

// Hooks
import { useRetrieveOrganizationMember } from '@/hooks/data/organization-managment';

// Permissions
import { hasWantedOrganizationRole } from '@repo/permissons/index';

export const TasksBoard: React.FC<{
	boardId: string;
	title: string;
	tasks: React.ReactNode;
}> = withReactQueryProvider(({ boardId, title, tasks }) => {
	const params = useParams<{ organizationId: string }>();
	const { data: member } = useRetrieveOrganizationMember({
		organizationId: params.organizationId,
	});
	return (
		<div className="border-input-border bg-muted flex min-h-[600px] w-full min-w-96 flex-col gap-5 rounded-xl border p-4 shadow-xl sm:w-2/3 lg:w-1/2 2xl:w-2/5">
			<div className="flex items-center justify-between">
				<h4 className="text-lg underline underline-offset-4">{title}</h4>
				<EditBoardDialog boardId={boardId} title={title} />
			</div>

			{tasks}

			<div className="flex gap-4">
				{hasWantedOrganizationRole({
					userRole: member?.success
						? member.organizationMember.role
						: undefined,
					requiredRoles: ['ADMIN'],
					ownerHasAllAccess: true,
				}) && (
					<>
						<AddTaskDialog organizationTasksBoardId={boardId} />
						<AddTaskAiDialog organizationTasksBoardId={boardId} />
					</>
				)}
			</div>
		</div>
	);
});
