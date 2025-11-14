'use client';

// External packages
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { twJoin } from 'tailwind-merge';
import { Dot } from '@/components/ui/dot';

export const UsersSidebar: React.FC<{
	id: string;
	username: string;
	userRole: string;
}> = ({ id, username, userRole }) => {
	const searchParams = useSearchParams();

	const pathname = usePathname();

	const isActive = searchParams.get('user') === id;
	const isOnline = false; // TODO: Replace with real online status
	return (
		<Link
			href={`${pathname}?user=${id}`}
			className={twJoin(
				'border-input-border flex items-center gap-4 border-b py-3',
				isActive && 'border-b-muted-foreground'
			)}
		>
			<Avatar
				imageProps={{
					src: '',
				}}
				size="lg"
			>
				{username}
			</Avatar>

			<div>
				<p className="text-md">{username} </p>
				<p className="text-muted-foreground text-xs md:text-sm">{userRole} </p>
			</div>

			<Dot
				state={isActive ? 'pending' : isOnline ? 'success' : 'destructive'}
				size="sm"
				className="ml-auto mt-2 self-start"
			/>
		</Link>
	);
};
