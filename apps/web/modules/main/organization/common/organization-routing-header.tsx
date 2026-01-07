'use client';

// External packages
import { useParams, usePathname } from 'next/navigation';

// Components
import { Dot } from '@/components/ui/dot';
import { LinkAsButton } from '@/components/ui/link-as-button';

export const OrganizationRoutingHeader = () => {
	const pathname = usePathname();
	const params = useParams<{ organizationId: string }>();
	return (
		<div className="bg-background sticky -top-10 z-20 -mx-4 mb-6 lg:mx-0">
			<div className="text-md no-scrollbar mt-10 flex gap-4 overflow-x-scroll whitespace-nowrap px-2 md:text-lg">
				<LinkAsButton
					variant="ghost"
					href={`/organization/${params.organizationId}`}
					className={pathname.split('/').length === 3 ? 'font-bold' : undefined}
					size="sm"
					iconRight={
						pathname.split('/').length === 3 && (
							<Dot size="md" className="absolute right-0 top-0" />
						)
					}
				>
					Posts
				</LinkAsButton>

				<LinkAsButton
					variant="ghost"
					href={`/organization/${params.organizationId}/group-chat`}
					className={pathname.includes('/group-chat') ? 'font-bold' : undefined}
					size="sm"
					iconRight={
						pathname.includes('/group-chat') && (
							<Dot size="md" className="absolute right-0 top-0" />
						)
					}
				>
					Group chat
				</LinkAsButton>
				<LinkAsButton
					variant="ghost"
					href={`/organization/${params.organizationId}/tasks`}
					className={pathname.includes('/tasks') ? 'font-bold' : undefined}
					size="sm"
					iconRight={
						pathname.includes('/tasks') && (
							<Dot size="md" className="absolute right-0 top-0" />
						)
					}
				>
					Tasks
				</LinkAsButton>

				{/* Group admin */}
				<LinkAsButton
					variant="ghost"
					href={`/organization/${params.organizationId}/manage`}
					size="sm"
					className={pathname.includes('/manage') ? 'font-bold' : undefined}
					iconRight={
						pathname.includes('/manage') && (
							<Dot size="md" className="absolute right-0 top-0" />
						)
					}
				>
					Manage attendees
				</LinkAsButton>
			</div>

			<hr className="bg-input-border mt-4 h-px w-full flex-shrink-0 border-0" />
		</div>
	);
};
