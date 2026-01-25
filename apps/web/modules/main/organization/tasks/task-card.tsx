'use client';

// External packages
import * as React from 'react';
import { EllipsisVertical } from 'lucide-react';
import { Button } from 'react-aria-components';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Dot } from '@/components/ui/dot';

// Types
import { RetrieveAllOrganizationBoardsWithTasksResponse } from '@repo/types/organization-tasks';

// Lib
import { convertToPascalCase } from '@/lib/utils/converter';
import { formatDate } from '@/lib/utils/time-adjustments';

export const TaskCard: React.FC<{
	task: RetrieveAllOrganizationBoardsWithTasksResponse['boardsWithTasks'][0]['organizationTasks'][0];
}> = ({ task }) => {
	return (
		<Button className="border-input-border relative cursor-pointer rounded-2xl border p-4 shadow-lg hover:opacity-80">
			<div className="flex justify-between">
				<div>
					<div className="flex items-center gap-4">
						<Dot
							state={
								task.status === 'LOW_PRIORITY'
									? 'success'
									: task.status === 'MEDIUM_PRIORITY'
										? 'pending'
										: 'destructive'
							}
						/>
						<p className="text-md">{task.title}</p>
					</div>
				</div>

				<EllipsisVertical className="text-muted-foreground size-4" />
			</div>
			<p className="text-muted-foreground text-start text-xs">
				{convertToPascalCase(task.status.replace('_', ' '))}
			</p>

			<div className="mt-3 flex items-center justify-between">
				<p className="text-muted-foreground text-sm">
					Deadline: {formatDate(task.dueDate)}
				</p>

				<div className="flex items-baseline gap-2">
					{/* Samo kao dekoracija */}
					<div className="relative">
						<Avatar
							size="sm"
							imageProps={{
								src: '',
							}}
							colorScheme="yellow"
						>
							John Doe
						</Avatar>
						<Avatar
							size="sm"
							imageProps={{
								src: '',
							}}
							colorScheme="gray"
							className="absolute -left-4 top-0"
						>
							John Doe
						</Avatar>
						<Avatar
							size="sm"
							imageProps={{
								src: '',
							}}
							colorScheme="orange"
							className="absolute -left-8 top-0 !bg-blue-400"
						>
							John Doe
						</Avatar>
					</div>
				</div>
			</div>
		</Button>
	);
};
