'use client';

// External packages
import { ArrowLeft } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { DotWithLabel } from '@/components/ui/dot';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { useGetUser } from '@/hooks/data/user';
import { useSearchParams } from 'next/navigation';
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const UsersInfoHeader = withReactQueryProvider(() => {
	const params = useSearchParams();
	const { data } = useGetUser(params.get('user') || '');
	return (
		<div className="border-input-border flex h-28 items-center gap-4 border-b px-4 sm:px-6 lg:px-8">
			<LinkAsButton
				variant="blank"
				href="/direct-messages"
				className="block lg:hidden"
			>
				<ArrowLeft />
			</LinkAsButton>

			{data && (
				<Avatar
					imageProps={{
						src: data?.image || '',
					}}
					size="xl"
				>
					{data.fullname}
				</Avatar>
			)}
			<div>
				<h4 className="text-lg lg:text-xl">{data?.fullname}</h4>

				{data && (
					<p className="text-muted-foreground">
						Last online:
						{new Date(data.updatedAt).toLocaleString().replaceAll('/', '.')}
					</p>
				)}
			</div>
			<DotWithLabel
				className="ml-auto"
				label="Online"
				dotProps={{ state: 'success', size: 'md' }}
			/>
		</div>
	);
});
