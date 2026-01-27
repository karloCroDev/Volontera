'use client';

// External pakcages
import * as React from 'react';
import Link from 'next/link';

// Components
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { RetrieveAllMembersInOrganizationResponse } from '@repo/types/organization-managment';
import { convertToFullname, convertToPascalCase } from '@/lib/utils/converter';
import { useGetImageFromKeys } from '@/hooks/data/image';
import { useDemoteOrPromoteOrganizationMember } from '@/hooks/data/organization-managment';
import { DemoteOrPromoteOrganizationMemberArgs } from '@repo/schemas/organization-managment';
import { useParams } from 'next/navigation';
import { toast } from '@/lib/utils/toast';
import { IRevalidateTag } from '@/lib/server/revalidation';

export const CurrentUsersForm: React.FC<{
	users: RetrieveAllMembersInOrganizationResponse;
}> = ({ users }) => {
	const params = useParams<{ organizationId: string }>();
	const { mutate } = useDemoteOrPromoteOrganizationMember();

	const onSubmit = ({
		role,
		userId,
	}: {
		userId: DemoteOrPromoteOrganizationMemberArgs['userId'];
		role: DemoteOrPromoteOrganizationMemberArgs['role'];
	}) => {
		mutate(
			{
				userId,
				role,
				organizationId: params.organizationId,
			},
			{
				onSuccess({ message, title }) {
					toast({
						title,
						content: message,
						variant: 'success',
					});
					IRevalidateTag('organization-members');
				},
				onError({ title, message }) {
					toast({
						title,
						content: message,
						variant: 'error',
					});
				},
			}
		);
	};

	const { data: images } = useGetImageFromKeys({
		imageUrls: users.members
			.map((member) => member.user.image)
			.filter((image) => image !== null),
	});

	return (
		<div className="border-input-border min-h-1/2 max-h-3/4 flex flex-col overflow-scroll rounded-xl border shadow-xl">
			{users.members.length > 0 ? (
				users.members.map((memeber) => (
					<div
						className="border-input-border bg-muted flex w-full items-center gap-4 border-b px-6 py-3 lg:gap-6"
						key={memeber.id}
					>
						<Link
							href={`/profile/${memeber.user.id}`}
							className="flex items-center gap-4"
						>
							<Avatar
								size="sm"
								imageProps={{
									src: memeber.user.image
										? images?.urls[memeber.user.image]
										: undefined,
								}}
								isVerified={memeber.user.subscriptionTier === 'PRO'}
							>
								{convertToFullname({
									firstname: memeber.user.firstName || '',
									lastname: memeber.user.lastName || '',
								})}
							</Avatar>

							<p className="underline-offset-2 hover:underline">
								{convertToFullname({
									firstname: memeber.user.firstName || '',
									lastname: memeber.user.lastName || '',
								})}
							</p>
						</Link>
						<p className="text-muted-foreground text-sm">
							{convertToPascalCase(memeber.role)}
						</p>

						<div className="ml-auto flex gap-3">
							{memeber.role === 'MEMBER' ? (
								<Button
									isFullyRounded
									colorScheme="success"
									size="xs"
									onPress={() =>
										onSubmit({
											role: 'ADMIN',
											userId: memeber.user.id,
										})
									}
								>
									Set to admin
								</Button>
							) : (
								<Button
									isFullyRounded
									colorScheme="yellow"
									size="xs"
									onPress={() =>
										onSubmit({
											role: 'MEMBER',
											userId: memeber.user.id,
										})
									}
								>
									Remove admin role
								</Button>
							)}
						</div>
					</div>
				))
			) : (
				<p className="text-muted-foreground my-auto text-center">
					No members in the organization.
				</p>
			)}
		</div>
	);
};
