'use client';

// External pakcages
import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Radio, RadioGroup } from 'react-aria-components';

// Components
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { RadioIconVisual } from '@/components/ui/radio';

// Types
import { RetrieveAllMembersInOrganizationResponse } from '@repo/types/organization-managment';

// Lib
import { convertToFullname, convertToPascalCase } from '@/lib/utils/converter';
import { toast } from '@/lib/utils/toast';
import { IRevalidateTag } from '@/lib/server/revalidation';

// Hooks
import {
	useDemoteOrPromoteOrganizationMember,
	useRemoveOrganizationMember,
} from '@/hooks/data/organization-managment';

// Schemas
import { DemoteOrPromoteOrganizationMemberArgs } from '@repo/schemas/organization-managment';

export const CurrentMembers: React.FC<{
	users: RetrieveAllMembersInOrganizationResponse;
}> = ({ users }) => {
	const params = useParams<{ organizationId: string }>();
	const { mutate: mutateDemoteOrPromoteMember } =
		useDemoteOrPromoteOrganizationMember();
	const { mutate: mutateRemoveMember } = useRemoveOrganizationMember();

	const demoteOrPromoteMember = ({
		role,
		userId,
	}: {
		userId: DemoteOrPromoteOrganizationMemberArgs['userId'];
		role: DemoteOrPromoteOrganizationMemberArgs['role'];
	}) => {
		mutateDemoteOrPromoteMember(
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

	const removeMember = ({
		userId,
	}: {
		userId: DemoteOrPromoteOrganizationMemberArgs['userId'];
	}) => {
		mutateRemoveMember(
			{
				userId,
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
										? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${memeber.user.image}`
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
						<Button
							className="ml-auto"
							isFullyRounded
							colorScheme="destructive"
							size="xs"
							variant="outline"
							onPress={() =>
								removeMember({
									userId: memeber.user.id,
								})
							}
						>
							Remove member
						</Button>

						<RadioGroup
							value={memeber.role}
							onChange={(role) => {
								if (role === memeber.role) {
									return;
								}

								demoteOrPromoteMember({
									role: role as DemoteOrPromoteOrganizationMemberArgs['role'],
									userId: memeber.user.id,
								});
							}}
							aria-label={`Member status for ${convertToFullname({
								firstname: memeber.user.firstName || '',
								lastname: memeber.user.lastName || '',
							})}`}
							className="flex items-center gap-4"
						>
							<Radio
								className="group flex cursor-pointer items-center gap-2"
								value="BANNED"
							>
								<RadioIconVisual className="size-3 rounded-full" />
								<p className="text-xs">Banned</p>
							</Radio>
							<Radio
								className="group flex cursor-pointer items-center gap-2"
								value="MEMBER"
							>
								<RadioIconVisual className="size-3 rounded-full" />
								<p className="text-xs">Member</p>
							</Radio>
							<Radio
								className="group flex cursor-pointer items-center gap-2"
								value="ADMIN"
							>
								<RadioIconVisual className="size-3 rounded-full" />
								<p className="text-xs">Admin</p>
							</Radio>
						</RadioGroup>
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
