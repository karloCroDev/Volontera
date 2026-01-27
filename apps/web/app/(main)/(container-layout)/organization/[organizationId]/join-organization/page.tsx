// External packages
import { redirect } from 'next/navigation';

// Components
import { Heading } from '@/components/ui/heading';

// Lib
import { getOrganizationDetailsById } from '@/lib/server/organization';
import { getSession } from '@/lib/server/user';

// Modules
import { JoinOrganizationForm } from '@/modules/main/organization/join-organization/join-organization-form';

export default async function JoinOrganizationPage({
	params,
}: {
	params: Promise<{ organizationId: string }>;
}) {
	const { organizationId } = await params;
	const user = await getSession();

	if (!user.success) redirect('/user/login');

	if (user.role !== 'USER') redirect('/home');

	const organization = await getOrganizationDetailsById(organizationId);

	if (!organization.success) redirect('/home');

	return (
		<>
			<Heading subtitle="Please enter the information about joining the organization">
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
