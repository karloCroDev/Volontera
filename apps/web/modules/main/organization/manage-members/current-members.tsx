'use client';

// External pakcages
import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Components
import { Avatar } from '@/components/ui/avatar';

// Modules
import {
	MemberRoles,
	RemoveMember,
} from '@/modules/main/organization/manage-members/handle-member';

// Lib
import { convertToFullname, convertToPascalCase } from '@/lib/utils/converter';
import { withReactQueryProvider } from '@/lib/utils/react-query';

// Hooks
import { useRetrieveAllMembersInOrganization } from '@/hooks/data/organization-managment';

export const CurrentMembers = withReactQueryProvider(
	({ organizationId }: { organizationId: string }) => {
		const { data } = useRetrieveAllMembersInOrganization({
			organizationId,
		});

		return (
			<div className="border-input-border min-h-1/2 max-h-3/4 flex flex-col overflow-scroll rounded-xl border shadow-xl">
				{data.members.length > 0 ? (
					data.members.map((member) => (
						<div
							className="border-input-border bg-muted flex w-full items-center gap-4 border-b px-6 py-3 lg:gap-6"
							key={member.id}
						>
							<Link
								href={`/profile/${member.user.id}`}
								className="flex items-center gap-4"
							>
								<Avatar
									size="sm"
									imageProps={{
										src: member.user.image
											? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${member.user.image}`
											: undefined,
									}}
									isVerified={member.user.subscriptionTier === 'PRO'}
								>
									{convertToFullname({
										firstname: member.user.firstName,
										lastname: member.user.lastName,
									})}
								</Avatar>

								<p className="underline-offset-2 hover:underline">
									{convertToFullname({
										firstname: member.user.firstName,
										lastname: member.user.lastName,
									})}
								</p>
							</Link>
							<p className="text-muted-foreground text-sm">
								{convertToPascalCase(member.role)}
							</p>
							<RemoveMember member={member} />
							<MemberRoles member={member} />
						</div>
					))
				) : (
					<p className="text-muted-foreground my-auto text-center">
						No members in the organization.
					</p>
				)}
			</div>
		);
	}
);
