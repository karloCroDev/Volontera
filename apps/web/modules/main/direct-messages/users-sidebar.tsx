'use client';

// External packages
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { twJoin } from 'tailwind-merge';

export const UsersSidebar: React.FC<{
	id: string;
	username: string;
	userRole: string;
}> = ({ id, username, userRole }) => {
	const searchParams = useSearchParams();

	const pathname = usePathname();

	const isActive = searchParams.get('user') === id;
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

			<div
				className={twJoin(
					'bg-pending ml-auto mt-2 size-3 self-start rounded-full'
				)}
			/>
		</Link>
	);
};
