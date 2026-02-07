'use client';

// External packages

import * as React from 'react';
import { useParams, usePathname } from 'next/navigation';

// Components
import { Dot } from '@/components/ui/dot';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Types
import { RetrieveOrganizationMemberResponse } from '@repo/types/organization-managment';

// Permissions
import { hasWantedOrganizationRole } from '@repo/permissons/index';

export const OrganizationRoutingHeader: React.FC<{
	member: RetrieveOrganizationMemberResponse; // Handleam na serveru validaciju je li zapravo korisnik unutar organizacije (kako bi passao ovdje ispravne podatke). Zbog toga ovdje samo onda handleam adminovu (vlasnikovu rutu)
}> = ({ member }) => {
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

				{/* Members */}
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

				{hasWantedOrganizationRole({
					userRole: member.organizationMember.role,
					requiredRoles: ['OWNER'],
					ownerHasAllAccess: false,
				}) && (
					<>
						<LinkAsButton
							variant="ghost"
							href={`/organization/${params.organizationId}/manage-members`}
							size="sm"
							className={
								pathname.includes('/manage-members') ? 'font-bold' : undefined
							}
							iconRight={
								pathname.includes('/manage-members') && (
									<Dot size="md" className="absolute right-0 top-0" />
								)
							}
						>
							Manage members
						</LinkAsButton>
					</>
				)}
			</div>

			<hr className="bg-input-border mt-4 h-px w-full flex-shrink-0 border-0" />
		</div>
	);
};
