/// External packages
import { notFound, redirect } from 'next/navigation';

// Components
import { Heading } from '@/components/ui/heading';

// Lib
import { getOrganizationDetailsById } from '@/lib/server/organization';
import { getSession } from '@/lib/server/user';

// Modules
import { EditOrganizationForm } from '@/modules/main/organization/edit-organization/edit-organization-form';

export default async function EditOrganizationPage({
	params,
}: {
	params: Promise<{ organizationId: string }>;
}) {
	const { organizationId } = await params;

	const [user, organizationDetailsById] = await Promise.all([
		getSession(),
		getOrganizationDetailsById(organizationId),
	]);

	if (!user.success) redirect('/user/login');
	if (!organizationDetailsById.success) notFound();

	if (organizationDetailsById.organization.owner.id !== user.id)
		redirect(`/organization/${organizationId}`);

	return (
		<>
			<Heading subtitle="Please enter the information about your organization inside these fields">
				Edit{' '}
				<span className="italic">
					{organizationDetailsById.organization.name}
				</span>{' '}
				details
			</Heading>

			<EditOrganizationForm
				organization={organizationDetailsById.organization}
			/>
		</>
	);
}
