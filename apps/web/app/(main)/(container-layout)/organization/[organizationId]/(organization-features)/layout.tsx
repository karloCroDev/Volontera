// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { OrganizationRoutingHeader } from '@/modules/main/organization/common/organization-routing-header';
import { LinkAsButton } from '@/components/ui/link-as-button';

export default async function OrganizationFeaturesLayout({
	params,
	children,
}: {
	params: Promise<{ organizationId: string }>;
	children: React.ReactNode;
}) {
	const { organizationId } = await params;
	return (
		<>
			<div className="border-input-border bg-muted flex flex-shrink-0 flex-col items-center gap-6 rounded-xl border p-4 md:h-40 md:flex-row md:px-6">
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
					<h1 className="text-lg font-medium md:text-2xl lg:text-3xl">
						Organization #1
					</h1>

					<p className="text-muted-foreground">30 attendees | 300 followers </p>
				</div>

				<div className="flex gap-4 md:ml-auto">
					<Button colorScheme="yellow" size="md">
						Follow
					</Button>
					<LinkAsButton
						colorScheme="orange"
						size="md"
						href={`/organization/${organizationId}/join-organization`}
					>
						Join
					</LinkAsButton>
				</div>
			</div>

			<OrganizationRoutingHeader />
			{children}
		</>
	);
}
