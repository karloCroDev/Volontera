// External packages
import { redirect } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { Container } from '@/components/ui/container';

// Lib
import { getOrganizationDetailsById } from '@/lib/server/organization';
import { getSession } from '@/lib/server/user';
import { convertToFullname } from '@/lib/utils/converter';

// USER-INVATATION JE JEDINA ZNAČAJKA KOJA JOŠ NIJE IMPLEMENTIRANA!!! (nije u dokumentaciji ni nigdje drugdje spomenuta, samo je UI emaila i stranice napravljen, ali ništa drugo osim toga)

export default async function InvitePage({
	params,
}: {
	params: Promise<{ organizationId: string }>;
}) {
	const { organizationId } = await params;
	const user = await getSession();

	if (!user.success) redirect('/user/login');
	// if (user.role !== 'USER') redirect('/home');

	const organization = await getOrganizationDetailsById(organizationId);
	if (!organization.success) redirect('/home');

	return (
		<div className="flex h-full items-center justify-center">
			<Container className="mx-auto flex w-fit flex-col justify-center rounded-lg p-6 shadow-lg lg:p-8">
				<h4 className="text-lg font-semibold italic underline underline-offset-4 lg:text-xl">
					Join {organization.organization.name}
				</h4>
				<p className="text-muted-foreground mt-3 text-sm lg:text-base">
					Hello {user.firstName},
				</p>
				<p className="text-muted-foreground mt-2 text-sm leading-6 lg:text-base">
					<strong className="text-background-foreground">
						{convertToFullname({
							firstname: organization.organization.owner.firstName,
							lastname: organization.organization.owner.lastName,
						})}
					</strong>{' '}
					has invited you to join{' '}
					<strong className="text-background-foreground">
						{organization.organization.name}
					</strong>
					.
				</p>
				<div className="mt-8 flex items-center justify-center gap-4 lg:gap-8">
					<Avatar
						size="2xl"
						colorScheme="orange"
						imageProps={{
							src: user.image ?? '',
						}}
					>
						{convertToFullname({
							firstname: user.firstName,
							lastname: user.lastName,
						})}
					</Avatar>

					<div className="text-muted-foreground bg-muted flex size-12 items-center justify-center rounded-full">
						<ArrowRight className="size-5" />
					</div>

					<Avatar
						size="2xl"
						colorScheme="yellow"
						imageProps={{
							src: organization.organization.avatarImage ?? '',
							alt: `${organization.organization.name} logo`,
						}}
					>
						{organization.organization.name}
					</Avatar>
				</div>
				<div className="mt-10 flex justify-center">
					<LinkAsButton
						href={`/organization/${organizationId}/join-organization`}
						className="w-full max-w-md"
						size="lg"
					>
						Join the organization
					</LinkAsButton>
				</div>
				<p className="text-muted-foreground mt-4 text-center text-xs lg:text-sm">
					If you don&apos;t recognize this organization, you can safely ignore
					this invaitation.
				</p>
			</Container>
		</div>
	);
}
