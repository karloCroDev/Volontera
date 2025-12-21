// Modules
import { AddBoard } from '@/modules/main/organization/tasks/add-board';
import { TasksBoard } from '@/modules/main/organization/tasks/tasks-board';

export default async function BoardPage() {
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
				{[...Array(6)].map((_, indx) => (
					<TasksBoard key={indx} />
				))}
			</div>
		</div>
	);
}
