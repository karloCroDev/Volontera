// External packages
import { ArrowLeft } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { DotWithLabel } from '@/components/ui/dot';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { useSession } from '@/hooks/data/auth';

export const UsersInfoHeader = () => {
	return (
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
					src: '',
				}}
				size="xl"
			>
				Karlo
			</Avatar>

			<div>
				<h4 className="text-lg lg:text-xl">Karlo Grgic</h4>
				<p className="text-muted-foreground">Last online: 19:03 22.11.2025</p>
			</div>
			<DotWithLabel
				className="ml-auto"
				label="Online"
				dotProps={{ state: 'success', size: 'md' }}
			/>
		</div>
	);
};
