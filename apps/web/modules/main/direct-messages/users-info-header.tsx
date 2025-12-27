'use client';

// External packages
import { ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// Components
import { Avatar } from '@/components/ui/avatar';
import { DotWithLabel } from '@/components/ui/dot';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Hooks
import { useGetUser } from '@/hooks/data/user';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { convertToFullname } from '@/lib/utils/convert-to-fullname';
import { useSocketContext } from '@/modules/main/direct-messages/SocketContext';
import { on } from 'events';

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

				<div>
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
							Last online:
							{new Date(user.updatedAt).toLocaleString().replaceAll('/', '.')}
						</p>
					)}
				</div>
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
