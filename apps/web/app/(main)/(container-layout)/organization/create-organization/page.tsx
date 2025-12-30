// Components
import { Heading } from '@/components/ui/heading';
import { getSession } from '@/lib/server/auth';

// Modules
import { CreateOrganizationForm } from '@/modules/main/create-organizations/create-organization-form';
import { redirect } from 'next/navigation';

export default async function CreateOrganizationPage() {
	const user = await getSession();

	// TODO: Fix this all with casl!!!!
	if (!user.success) redirect('/user/login');

	if (user.role !== 'ORGANIZATION') redirect('/home');
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
