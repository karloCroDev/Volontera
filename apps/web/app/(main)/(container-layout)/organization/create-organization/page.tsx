// Components
import { Heading } from '@/components/ui/heading';

// Lib
import { getSession } from '@/lib/server/user';

// Modules
import { CreateOrganizationForm } from '@/modules/main/organization/create-organizations/create-organization-form';

import { redirect } from 'next/navigation';
import { isOrganizationAccount } from '@repo/permissons/index';

export default async function CreateOrganizationPage() {
	const user = await getSession();

	if (!user.success) redirect('/user/login');

	if (!isOrganizationAccount(user.role)) redirect('/home');

	console.log(user);
	return (
		<>
			<Heading subtitle="Please enter the information about your organization inside these fields">
				Let&apos;s create new organization
			</Heading>

			<CreateOrganizationForm />
		</>
	);
}
