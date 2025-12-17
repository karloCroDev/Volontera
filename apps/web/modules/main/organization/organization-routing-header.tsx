// External packages
import Link from 'next/link';

// Components
import { Dot } from '@/components/ui/dot';

export const OrganizationRoutingHeader = () => {
	return (
		<>
			<div className="mt-10 flex gap-8 text-lg">
				<div className="relative">
					<Link href="" className="font-bold">
						Posts
					</Link>
					<Dot size="md" className="absolute -right-3.5 top-0" />
				</div>
				<Link href="">Group chat</Link>
				<Link href="">Board</Link>
				<Link href="">Posts</Link>

				{/* Group admin */}
				<Link href="">Manage attendees</Link>
			</div>

			<hr className="bg-input-border mb-6 mt-4 h-px w-full flex-shrink-0 border-0" />
		</>
	);
};
