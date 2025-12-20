// External packages
import { Ellipsis, Plus } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { AddBoard } from '@/modules/main/organization/tasks/add-board';
import { TaskModal } from '@/modules/main/organization/tasks/task-modal';

export default async function BoardPage() {
	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h4 className="text-xl lg:text-2xl">Tasks</h4>
					<p className="text-muted-foreground">
						All tasks that are assigned inside this organization
					</p>
				</div>
				<AddBoard />
			</div>
			<div className="flex min-h-0 flex-1 gap-4 overflow-y-scroll">
				<div className="border-input-border bg-muted flex flex-1 flex-col gap-5 rounded-xl border p-4">
					<div className="flex items-center justify-between">
						<h4 className="text-lg underline underline-offset-4">
							Clean the beach
						</h4>
						<Button variant="blank">
							<Ellipsis className="text-muted-foreground" />
						</Button>
					</div>

					<div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-scroll">
						<TaskModal
							cardProps={{
								title: 'Save the earth',
								description: 'Save the earth from xxxxxx',
								indefiniteDate: `${new Date().toLocaleString('default', { month: 'long' }).slice(0, 3)} ${new Date().getDate()}`,

								isUserIncluded: true,
								otherUsersCount: 3,
								state: 'success',
							}}
							specificDate={new Date()
								.toLocaleDateString()
								.replaceAll('/', '. ')}
						/>
					</div>

					<Button isFullyRounded variant="outline" iconRight={<Plus />}>
						Add Card
					</Button>
				</div>

				<div className="border-input-border bg-muted flex-1 rounded-xl border p-4">
					<h4 className="text-lg">Clean the beach</h4>
				</div>
			</div>
		</>
	);
}
