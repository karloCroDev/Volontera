'use client';

// External packages
import * as React from 'react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Dot, DotProps } from '@/components/ui/dot';
import { EllipsisVertical } from 'lucide-react';
import { Button } from 'react-aria-components';

export type TaskCardProps = {
	title: string;
	description: string;
	date: Date;
	state: DotProps['state'];
	isUserIncluded: boolean;
	otherUsersCount: number;
	// When I get data for additional users then add them
};

export const TaskCard: React.FC<TaskCardProps> = ({
	title,
	description,
	date,
	state,
	isUserIncluded,
	otherUsersCount,
}) => {
	return (
		<Button className="border-input-border relative cursor-pointer rounded-2xl border p-4 hover:opacity-80">
			<div className="flex justify-between">
				<div>
					<div className="flex items-center gap-4">
						<Dot state={state} />
						<p className="text-md">{title}</p>
					</div>
				</div>
				<EllipsisVertical className="text-muted-foreground size-4" />
			</div>
			<p className="text-muted-foreground text-start text-xs">{description}</p>

			<div className="mt-3 flex items-center justify-between">
				<p className="text-muted-foreground text-sm">
					Deadline:{' '}
					{date.toLocaleString('default', { month: 'long' }).slice(0, 3) +
						' ' +
						date.getDate()}
				</p>
				{/* Add different background colors */}

				<div className="flex items-baseline gap-2">
					<div className="relative">
						<Avatar
							size="sm"
							imageProps={{
								src: '',
							}}
							colorScheme="yellow"
						>
							Orrr
						</Avatar>
						<Avatar
							size="sm"
							imageProps={{
								src: '',
							}}
							colorScheme="gray"
							className="absolute -left-4 top-0"
						>
							Orrr
						</Avatar>
						<Avatar
							size="sm"
							imageProps={{
								src: '',
							}}
							colorScheme="orange"
							className="absolute -left-8 top-0 !bg-blue-400"
						>
							Orrr
						</Avatar>
					</div>

					<p className="text-muted-foreground text-xs">
						+ {otherUsersCount} other users {isUserIncluded && 'including you'}
					</p>
				</div>
			</div>
		</Button>
	);
};
