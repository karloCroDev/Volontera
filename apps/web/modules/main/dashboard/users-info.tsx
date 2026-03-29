'use client';

// External packages
import * as React from 'react';

// Components
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

// Hooks

// Lib
import { convertToFullname } from '@/lib/utils/converter';
import { UserResponse } from '@repo/types/user';
import { DashboardPaginatedUsersResponse } from '@repo/types/dashboard';

export type UserFilter = 'all' | 'users' | 'organizators';

export const UsersInfoSkelton = () => (
	<div className="border-input-border flex w-full justify-between border-t px-4 py-3">
		<div className="flex min-w-0 items-center gap-4">
			<Skeleton className="h-8 w-8 rounded-full" />

			<div className="flex flex-col gap-2">
				<Skeleton className="h-3 w-32" />
				<Skeleton className="h-3 w-48" />
			</div>
		</div>

		<div className="flex items-center gap-8">
			<Skeleton className="h-3 w-20" />
			<Skeleton className="h-6 w-12 rounded-full" />
		</div>
	</div>
);

export const UserInfo: React.FC<{
	user: DashboardPaginatedUsersResponse['users'][0];
}> = ({ user }) => {
	return (
		<div className="border-input-border flex w-full justify-between border-t px-4 py-3">
			<div className="flex min-w-0 items-center gap-4">
				<Avatar
					imageProps={{
						src: user.image || '',
						alt: `${convertToFullname({
							firstname: user.firstName,
							lastname: user.lastName,
						})} profile image`,
					}}
					size="sm"
				>
					{convertToFullname({
						firstname: user.firstName,
						lastname: user.lastName,
					})}
				</Avatar>
				<div>
					<p>
						{' '}
						{convertToFullname({
							firstname: user.firstName,
							lastname: user.lastName,
						})}
					</p>
					<p className="text-muted-foreground truncate text-xs">{user.email}</p>
				</div>
			</div>
			<div className="flex items-center gap-8">
				<p className="text-muted-foreground ml-auto text-sm">
					{user.role === 'ORGANIZATION' ? 'Organizator' : 'Volunteer'}
				</p>
				<Button
					size="xs"
					variant="outline"
					colorScheme="destructive"
					isFullyRounded
				>
					Ban
				</Button>
			</div>
		</div>
	);
};
