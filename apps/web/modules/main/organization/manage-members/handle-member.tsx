'use client';

// External pakcages
import * as React from 'react';
import { Radio, RadioGroup } from 'react-aria-components';
import { useParams } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { RadioIconVisual } from '@/components/ui/radio';

// Lib
import { toast } from '@/lib/utils/toast';

// Schemas
import { DemoteOrPromoteOrganizationMemberArgs } from '@repo/schemas/organization-managment';
import {
	useDemoteOrPromoteOrganizationMember,
	useRemoveOrganizationMember,
} from '@/hooks/data/organization-managment';
import { RetrieveAllMembersInOrganizationResponse } from '@repo/types/organization-managment';

export const MemberRoles: React.FC<{
	member: RetrieveAllMembersInOrganizationResponse['members'][0];
}> = ({ member }) => {
	const params = useParams<{ organizationId: string }>();

	const { mutate: mutateDemoteOrPromoteMember } =
		useDemoteOrPromoteOrganizationMember();

	return (
		<RadioGroup
			value={member.role}
			onChange={(role) => {
				if (role === member.role) {
					return;
				}

				mutateDemoteOrPromoteMember(
					{
						userId: member.user.id,
						role: role as DemoteOrPromoteOrganizationMemberArgs['role'],
						organizationId: params.organizationId,
					},
					{
						onSuccess({ message, title }) {
							toast({
								title,
								content: message,
								variant: 'success',
							});
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
			}}
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
	);
};

export const RemoveMember: React.FC<{
	member: RetrieveAllMembersInOrganizationResponse['members'][0];
}> = ({ member }) => {
	const { mutate: mutateRemoveMember } = useRemoveOrganizationMember();
	const params = useParams<{ organizationId: string }>();

	return (
		<Button
			className="ml-auto"
			isFullyRounded
			colorScheme="destructive"
			size="xs"
			variant="outline"
			onPress={() => {
				mutateRemoveMember(
					{
						userId: member.user.id,
						organizationId: params.organizationId,
					},
					{
						onSuccess({ message, title }) {
							toast({
								title,
								content: message,
								variant: 'success',
							});
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
			}}
		>
			Remove member
		</Button>
	);
};
