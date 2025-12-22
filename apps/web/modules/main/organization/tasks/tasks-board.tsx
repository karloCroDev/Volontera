// External packages
import { Ellipsis } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';

// Modules
import { AddTask } from '@/modules/main/organization/tasks/add-task';
import { TaskModal } from '@/modules/main/organization/tasks/task-modal';

export const TasksBoard = () => {
	return (
		<div className="border-input-border bg-muted sm:min-w-2/3 lg:min-w-1/2 2xl:min-w-2/5 flex min-h-[600px] min-w-full flex-1 flex-col gap-5 rounded-xl border p-4">
			<div className="flex items-center justify-between">
				<h4 className="text-lg underline underline-offset-4">
					Clean the beach
				</h4>
				<Button variant="blank">
					<Ellipsis className="text-muted-foreground" />
				</Button>
			</div>

			<div className="no-scrollbar flex flex-1 flex-col gap-4">
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
			</div>

			<AddTask />
		</div>
	);
};
