// External packages
import { ArrowLeft, Ban, MessageCircle } from 'lucide-react';

// Components
import { LinkAsButton } from '@/components/ui/link-as-button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Container } from '@/components/ui/container';
import { getOrganizationDetailsById } from '@/lib/server/organization';
import { redirect } from 'next/navigation';
import { convertToFullname, convertToPascalCase } from '@/lib/utils/converter';
import { retrieveOrganizationMember } from '@/lib/server/organization-managment';

export default async function BannedPage({
	params,
}: {
	params: Promise<{ organizationId: string }>;
}) {
	const { organizationId } = await params;

	const member = await retrieveOrganizationMember(organizationId);

	if (!member.success || !member.organizationMember.isBanned)
		redirect(`/organization/${organizationId}`);

	const organization = await getOrganizationDetailsById(organizationId);

	if (!organization.success) redirect(`/organization/${organizationId}`);

	const organizationAdmin = organization.organization.owner;

	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<Ban className="text-destructive size-80" />

			<div className="mt-8 flex flex-col gap-4 lg:mt-10 lg:flex-row lg:gap-6">
				<div className="max-w-3xl">
					<h1 className="text-balance text-4xl font-semibold">
						You have been banned from activities in this organization
					</h1>
					<p className="text-muted-foreground mt-2">
						Please contact the organization owner for more information:
					</p>
				</div>
				<Container className="flex flex-col gap-4 rounded-md p-6">
					<LinkAsButton
						href={`/profile/${organizationAdmin.id}`}
						variant="outline"
						colorScheme="yellow"
						size="sm"
						iconRight={<MessageCircle />}
						isFullyRounded
						className="self-center"
						iconLeft={
							<Avatar
								imageProps={{
									src: organizationAdmin.image
										? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${organizationAdmin.image}`
										: undefined,
								}}
								size="sm"
							>
								{convertToFullname({
									firstname: organizationAdmin.firstName,
									lastname: organizationAdmin.lastName,
								})}
							</Avatar>
						}
					>
						<div className="flex flex-col items-start">
							<p>
								{convertToFullname({
									firstname: organizationAdmin.firstName,
									lastname: organizationAdmin.lastName,
								})}
							</p>
							<p className="text-muted-foreground text-xs">
								Organization |{' '}
								{convertToPascalCase(organizationAdmin.subscriptionTier)}
							</p>
						</div>
					</LinkAsButton>
					<Separator />

					<LinkAsButton
						href="/home"
						iconLeft={<ArrowLeft />}
						className="self-center"
					>
						Go back home
					</LinkAsButton>
				</Container>
			</div>
		</div>
	);
}
