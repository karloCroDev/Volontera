'use client';

// External packages
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { CircleX } from 'lucide-react';
import { Loader } from 'lucide-react';
import { Check } from 'lucide-react';
import { twJoin } from 'tailwind-merge';

export const ProgressTracker = () => {
	const pathname = usePathname();
	const type = pathname.split('/').at(-1);

	return (
		<aside className="mt-16 flex h-fit flex-col items-center lg:mt-0 lg:h-full lg:justify-center">
			<h1 className="text-balance text-center text-lg font-semibold lg:text-2xl">
				A few steps away from accessing the [app]
			</h1>

			<div className="mt-12 flex items-center lg:mt-16 lg:flex-col lg:items-start">
				<StatusCheckpoint type="Credentials" status="completed" isRequired />
				<hr className="bg-muted mb-14 h-[2px] w-16 border-0 sm:w-20 lg:my-12 lg:ml-3.5 lg:w-20 lg:rotate-90" />
				<StatusCheckpoint
					type="Choose type"
					// User lands so that implies that it will be only pending or completed
					status={type === 'app-type' ? 'pending' : 'completed'}
					isRequired
				/>
				<hr className="bg-muted mb-14 h-[2px] w-16 border-0 sm:w-20 lg:my-12 lg:ml-3.5 lg:w-20 lg:rotate-90" />
				<StatusCheckpoint
					type="Additional info"
					status={
						// It will be routed, so no need to worry about success checmark because I am routing the user
						type === 'additional-information' ? 'pending' : 'not-fullffiled'
					}
				/>
			</div>
		</aside>
	);
};

const StatusCheckpoint = ({
	type,
	isRequired = false,
	status,
}: {
	type: string;
	isRequired?: boolean;
	status: 'pending' | 'not-fullffiled' | 'completed';
}) => {
	return (
		<div className="flex w-fit flex-col items-center gap-x-5 gap-y-2 lg:flex-row">
			<div
				className={twJoin(
					'border-input-border bg-muted size-20 rounded-full p-4 lg:size-28 lg:p-6'
				)}
			>
				{status === 'pending' && (
					<Loader className="bg-pending h-full w-full animate-spin rounded-full p-4 text-white" />
				)}
				{status === 'completed' && (
					<Check className="bg-success h-full w-full rounded-full p-4 text-black" />
				)}
				{status === 'not-fullffiled' && (
					<CircleX className="bg-destructive h-full w-full rounded-full p-4 text-white" />
				)}
			</div>
			<div>
				<p className="sm:text-md text-balance text-center lg:text-lg">{type}</p>
				<p className="text-muted-foreground">
					{isRequired ? 'Required' : 'Optional'}
				</p>
			</div>
		</div>
	);
};
