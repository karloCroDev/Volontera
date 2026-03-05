'use client';

// External packages
import * as React from 'react';
import { useParams, usePathname } from 'next/navigation';

// Components
import { Dot } from '@/components/ui/dot';
import { LinkAsButton } from '@/components/ui/link-as-button';

export const DashboardRoutingHeader = () => {
	const pathname = usePathname();
	const params = useParams();
	return (
		<>
			<div className="bg-background sticky -top-10 z-20 -mx-4 mb-6 lg:mx-0">
				<div className="text-md no-scrollbar flex gap-4 overflow-x-scroll whitespace-nowrap px-2 md:text-lg">
					<LinkAsButton
						variant="ghost"
						href="/dashboard"
						className={
							pathname.includes('/dashboard') &&
							pathname.split('/').length === 2
								? 'font-bold'
								: undefined
						}
						size="sm"
						iconRight={
							pathname.includes('/dashboard') &&
							pathname.split('/').length === 2 && (
								<Dot size="md" className="absolute right-0 top-0" />
							)
						}
					>
						Manage users
					</LinkAsButton>
					<LinkAsButton
						variant="ghost"
						href="/dashboard/reports"
						className={
							pathname.includes('/dashboard/reports') ? 'font-bold' : undefined
						}
						size="sm"
						iconRight={
							pathname.includes('/dashboard/reports') && (
								<Dot size="md" className="absolute right-0 top-0" />
							)
						}
					>
						Reports
					</LinkAsButton>
				</div>

				<hr className="bg-input-border mt-4 h-px w-full flex-shrink-0 border-0" />
			</div>
		</>
	);
};
