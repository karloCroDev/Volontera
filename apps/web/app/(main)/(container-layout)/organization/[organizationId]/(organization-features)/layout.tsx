// External packages
import { notFound } from 'next/navigation';
import { UserLock } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { OrganizationRoutingHeader } from '@/modules/main/organization/common/organization-routing-header';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Lib
import { getOrganizationDetailsById } from '@/lib/server/organization';
import { retrieveOrganizationMember } from '@/lib/server/organization-managment';
import { FollowOrganizationButton } from '@/modules/main/organization/common/follow-organization-button';
import { LeaveOrganizationDialog } from '@/modules/main/organization/common/leave-organization-dialog';

export default async function OrganizationFeaturesLayout({
	params,
	children,
}: {
	params: Promise<{ organizationId: string }>;
	children: React.ReactNode;
}) {
	const { organizationId } = await params;

	const [organizationDetailsById, member] = await Promise.all([
		await getOrganizationDetailsById(organizationId),
		await retrieveOrganizationMember(organizationId),
	]);

	if (!organizationDetailsById.success) notFound();

	return (
		<>
			<div className="border-input-border bg-muted relative flex flex-shrink-0 flex-col items-center gap-6 rounded-xl border p-4 shadow-lg md:h-32 md:flex-row md:px-6">
				<Avatar
					imageProps={{
						src: organizationDetailsById.organization.avatarImage,
					}}
					size="xl"
					colorScheme="gray"
					isVerified={
						organizationDetailsById.organization.owner.subscriptionTier ===
						'PRO'
					}
				>
					{organizationDetailsById.organization.name}
				</Avatar>

				<div className="flex flex-col">
					<h1 className="text-lg font-medium md:text-2xl lg:text-3xl">
						{organizationDetailsById.organization.name}
					</h1>

					<p className="text-muted-foreground">
						{organizationDetailsById.organization._count.organizationMembers}{' '}
						members |{' '}
						{organizationDetailsById.organization._count.organizationFollowers}{' '}
						followers{' '}
					</p>
				</div>

				{((member.success && member.organizationMember.role !== 'OWNER') ||
					!member.success) && (
					<div className="flex gap-4 md:ml-auto">
						<FollowOrganizationButton
							// Dobivam samo korisnika u ovom arrayu
							hasUserFollowed={organizationDetailsById.isFollowing}
						/>

						{member.success ? (
							<LeaveOrganizationDialog
								organizationName={organizationDetailsById.organization.name}
							/>
						) : (
							<LinkAsButton
								colorScheme="orange"
								size="md"
								href={`/organization/${organizationId}/join-organization`}
							>
								Join
							</LinkAsButton>
						)}
					</div>
				)}
			</div>

			{!member.success || !member.organizationMember.role ? (
				<>
					<UserLock className="text-muted-foreground mx-auto mt-20 size-16" />
					<h4 className="text-muted-foreground mt-8 text-balance text-center text-lg">
						You haven&apos;t joined the organization yet. Please join to access
						the organization features
					</h4>
				</>
			) : (
				<>
					<OrganizationRoutingHeader member={member} />
					{children}
				</>
			)}
		</>
	);
}
