'use client';

// External pakcages
import * as React from 'react';
import { Form } from 'react-aria-components';
import Link from 'next/link';

// Components
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { RetrieveAllMembersInOrganizationResponse } from '@repo/types/organization-managment';
import { convertToFullname, convertToPascalCase } from '@/lib/utils/converter';

// Schemas
// import { NotificationIdsArgs } from '@repo/schemas/notification';

export const CurrentUsersForm: React.FC<{
	users: RetrieveAllMembersInOrganizationResponse;
}> = ({ users }) => {
	// const [ids, setIds] = React.useState<NotificationIdsArgs['notificationIds']>(
	// 	[]
	// );
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	console.log(users.requests[0]);
	return (
		<Form
			className="border-input-border min-h-1/2 max-h-3/4 overflow-scroll rounded-xl border py-1"
			onSubmit={onSubmit}
		>
			{users.requests.map((user) => (
				<div
					className="border-input-border flex w-full items-center gap-4 border-b px-6 py-3 lg:gap-6"
					key={user.id}
				>
					<Link href="/" className="flex items-center gap-4">
						<Avatar
							size="sm"
							imageProps={{
								src: '',
							}}
						>
							{convertToFullname({
								firstname: user.user.firstName || '',
								lastname: user.user.lastName || '',
							})}
						</Avatar>

						<p className="underline-offset-2 hover:underline">
							{convertToFullname({
								firstname: user.user.firstName || '',
								lastname: user.user.lastName || '',
							})}
						</p>
					</Link>
					<p className="text-muted-foreground text-sm">
						{convertToPascalCase(user.role)}
					</p>

					<div className="ml-auto flex gap-3">
						<Button isFullyRounded colorScheme="success" size="xs">
							Set to admin
						</Button>
						<Button isFullyRounded colorScheme="yellow" size="xs">
							Remove admin role
						</Button>
					</div>
				</div>
			))}
		</Form>
	);
};
