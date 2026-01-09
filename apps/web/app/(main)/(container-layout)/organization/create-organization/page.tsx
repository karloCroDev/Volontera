// Components
import { Heading } from '@/components/ui/heading';
import { LayoutColumn } from '@/components/ui/layout-grid';
import { getSession } from '@/lib/server/user';

// Modules
import { CreateOrganizationForm } from '@/modules/main/organization/create-organizations/create-organization-form';
import { Layout } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function CreateOrganizationPage() {
	const user = await getSession();

	if (!user.success) redirect('/user/login');

	if (user.role !== 'ORGANIZATION') redirect('/home');

	console.log(user);
	return (
		<>
			<Heading
				subtitle="Please enter the information about your organization inside these fields"
				className="ml-0 md:ml-8"
			>
				Let&apos;s create new organization
			</Heading>

			<CreateOrganizationForm />
		</>
	);
}
