'use client';

// External packages
import { ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Components
import { Avatar } from '@/components/ui/avatar';
import { DotWithLabel } from '@/components/ui/dot';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Hooks
import { useGetUser } from '@/hooks/data/user';

// Modules
import { useSocketContext } from '@/modules/main/direct-messages/socket-context';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { convertToFullname } from '@/lib/utils/converter';
import { formatTime } from '@/lib/utils/time-adjustments';

export const UsersInfoHeader = withReactQueryProvider(() => {
	const params = useSearchParams();
	const { data: user } = useGetUser(params.get('user') || '');

	const { onlineUsers } = useSocketContext();

	return (
		user && (
			<div className="border-input-border flex h-28 items-center gap-4 border-b px-4 sm:px-6 lg:px-8">
				<LinkAsButton
					variant="blank"
					href="/direct-messages"
					className="block lg:hidden"
				>
					<ArrowLeft />
				</LinkAsButton>

				<Link href={`/profile/${user.id}`}>
					<Avatar
						imageProps={{
							src: user?.image || undefined,
						}}
						size="xl"
					>
						{convertToFullname({
							firstname: user.firstName,
							lastname: user.lastName,
						})}
					</Avatar>
				</Link>
				<Link href={`/profile/${user.id}`}>
					{user && (
						<h4 className="text-lg lg:text-xl">
							{convertToFullname({
								firstname: user.firstName,
								lastname: user.lastName,
							})}
						</h4>
					)}

					{user && (
						<p className="text-muted-foreground">
							{onlineUsers.includes(user.id)
								? 'Currently online'
								: ` Last online: ${formatTime(new Date(user.updatedAt))}`}
						</p>
					)}
				</Link>
				<DotWithLabel
					className="ml-auto"
					label={onlineUsers.includes(user.id) ? 'Online' : 'Offline'}
					dotProps={{
						state: onlineUsers.includes(user.id) ? 'success' : 'destructive',
						size: 'md',
					}}
				/>
			</div>
		)
	);
});
