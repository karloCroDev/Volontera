// Components
import { Dot } from '@/components/ui/dot';
import { LinkAsButton } from '@/components/ui/link-as-button';

export const OrganizationRoutingHeader = () => {
	return (
		<div className="bg-background sticky -top-10 z-20 -mx-4 mb-6 lg:mx-0">
			<div className="text-md no-scrollbar mt-10 flex gap-4 overflow-x-scroll whitespace-nowrap px-2 md:text-lg">
				<div className="relative">
					<LinkAsButton
						variant="ghost"
						href="/123"
						className="relative font-bold"
						size="sm"
						iconRight={<Dot size="md" className="absolute right-0 top-0" />}
					>
						Posts
					</LinkAsButton>
				</div>
				<LinkAsButton variant="ghost" href="/123/group-chat" size="sm">
					Group chat
				</LinkAsButton>
				<LinkAsButton variant="ghost" href="/123/tasks" size="sm">
					Tasks
				</LinkAsButton>

				{/* Group admin */}
				<LinkAsButton variant="ghost" href="/123/manage" size="sm">
					Manage attendees
				</LinkAsButton>
			</div>

			<hr className="bg-input-border mt-4 h-px w-full flex-shrink-0 border-0" />
		</div>
	);
};
