// External packages
import Link from 'next/link';

// Components
import { Dot } from '@/components/ui/dot';
import { LinkAsButton } from '@/components/ui/link-as-button';

export const OrganizationRoutingHeader = () => {
	return (
		<div className="bg-background sticky -top-8 z-20 mb-6">
			<div className="mt-10 flex gap-4 overflow-x-scroll whitespace-nowrap text-lg">
				<div className="relative">
					<LinkAsButton
						variant="ghost"
						href=""
						className="relative font-bold"
						size="sm"
						iconRight={<Dot size="md" className="absolute right-0 top-0" />}
					>
						Posts
					</LinkAsButton>
				</div>
				<LinkAsButton variant="ghost" href="" size="sm">
					Group chat
				</LinkAsButton>
				<LinkAsButton variant="ghost" href="" size="sm">
					Board
				</LinkAsButton>
				<LinkAsButton variant="ghost" href="" size="sm">
					Posts
				</LinkAsButton>

				{/* Group admin */}
				<LinkAsButton variant="ghost" href="" size="sm">
					Manage attendees
				</LinkAsButton>
			</div>

			<hr className="bg-input-border mt-4 h-px w-full flex-shrink-0 border-0" />
		</div>
	);
};
