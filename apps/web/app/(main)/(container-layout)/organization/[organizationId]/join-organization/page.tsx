// External packages
import { redirect } from 'next/navigation';

// Components
import { Heading } from '@/components/ui/heading';
import { getOrganizationDetailsById } from '@/lib/server/organization';
import { getSession } from '@/lib/server/user';

// Modules
import { JoinOrganizationForm } from '@/modules/main/join-organization/join-organization-form';

export default async function JoinOrganizationPage({
	params,
}: {
	params: Promise<{ organizationId: string }>;
}) {
	const { organizationId } = await params;
	const user = await getSession();

	if (!user.success) redirect('/user/login');

	// if (user.role !== 'USER') redirect('/home'); // TODO: Uncommen this when I am ready

	const organization = await getOrganizationDetailsById(organizationId);

	if (!organization.success) redirect('/home');

	return (
		<>
			<Heading
				subtitle="Please enter the information about joining the organization"
				className="ml-0 md:ml-8"
			>
				Let&apos;s join {organization.organization.name} organization
			</Heading>
			<JoinOrganizationForm
				externalForm={
					organization.organization.organizationInfo.externalFormLink
				}
			/>
		</>
	);
}
