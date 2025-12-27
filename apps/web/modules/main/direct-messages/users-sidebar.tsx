'use client';

// External packages
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { twJoin } from 'tailwind-merge';
import { Dot } from '@/components/ui/dot';
import Markdown from 'react-markdown';

export const UsersSidebar: React.FC<{
	id: string;
	conversationId?: string; // Npr. kod searcha nećemo imati conversationId
	username: string;
	userRole?: string;
	lastMessage?: string;
	removeUnderline?: boolean;
	isOnline?: boolean;
}> = ({
	id,
	conversationId,
	username,
	userRole,
	lastMessage,
	removeUnderline = false,
	isOnline,
}) => {
	const searchParams = useSearchParams();

	const pathname = usePathname();

	const isActive = searchParams.get('user') === id;

	return (
		<Link
			href={
				conversationId
					? `${pathname}?user=${id}&conversationId=${conversationId}`
					: `${pathname}?user=${id}`
			}
			className={twJoin(
				'border-input-border hover:bg-background-foreground/10 flex items-center gap-4 rounded-lg px-2 py-3 backdrop-blur-2xl',
				isActive && 'border-b-muted-foreground font-semibold',
				removeUnderline && 'border-b-0'
			)}
		>
			<Avatar imageProps={{}} size="lg">
				{username}
			</Avatar>

			<div>
				<p className="text-md">{username} </p>
				<div className="text-muted-foreground text-xs md:text-sm">
					{lastMessage ? <Markdown>{lastMessage}</Markdown> : userRole}
				</div>
			</div>

			<Dot
				state={isActive ? 'pending' : isOnline ? 'success' : 'destructive'}
				size="sm"
				className="ml-auto mt-2 self-start"
			/>
		</Link>
	);
};

export const UsersSidebarSkeleton = () => (
	<div className="flex items-center gap-3 rounded-md p-2">
		<div className="bg-muted h-10 w-10 flex-shrink-0 animate-pulse rounded-full" />
		<div className="flex-1">
			<div className="bg-muted mb-2 h-3 w-1/3 animate-pulse rounded" />
			<div className="bg-muted h-3 w-1/2 animate-pulse rounded" />
		</div>
	</div>
);
