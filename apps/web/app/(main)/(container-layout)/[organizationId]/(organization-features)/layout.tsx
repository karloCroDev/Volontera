// Components
import { Tag } from '@/components/ui/tag';
import { SharePost } from '@/components/ui/post/share-post';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { Dot } from '@/components/ui/dot';
import { OrganizationRoutingHeader } from '@/modules/main/organization/common/organization-routing-header';

export default async function OrganizationFeaturesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="border-input-border bg-muted flex h-40 flex-shrink-0 items-center gap-6 rounded-xl px-6">
				<Avatar
					imageProps={{
						src: '',
					}}
					size="xl"
					colorScheme="gray"
				>
					Organization
				</Avatar>

				<div className="flex flex-col">
					<h1 className="text-xl font-medium md:text-2xl lg:text-3xl">
						Organization #1
					</h1>

					<p className="text-muted-foreground">30 attendees | 300 followers </p>
				</div>

				<div className="ml-auto flex gap-4">
					<Button colorScheme="yellow" size="md">
						Follow
					</Button>
					<Button colorScheme="orange" size="md">
						Join
					</Button>
				</div>
			</div>

			<OrganizationRoutingHeader />

			{children}
		</>
	);
}
