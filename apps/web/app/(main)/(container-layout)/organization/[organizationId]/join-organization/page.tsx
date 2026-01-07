// External packages
import { redirect } from 'next/navigation';

// Components
import { Heading } from '@/components/ui/heading';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';

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
			<Heading
				subtitle="Please enter the information about joining the organization"
				className="ml-0 md:ml-8"
			>
				Let&apos;s join {organization.organization.name} organization
			</Heading>

			<Layout>
				<LayoutColumn
					start={{
						base: 1,
						// Malo od manje centra (bolje izgleda)
						md: 4,
						xl: 3,
					}}
					end={{
						base: 13,
						// Malo od manje centra (bolje izgleda)
						md: 10,
						xl: 9,
					}}
					className="flex flex-col"
				>
					<JoinOrganizationForm
						externalForm={
							organization.organization.organizationInfo.externalFormLink
						}
					/>
				</LayoutColumn>
			</Layout>
		</>
	);
}
