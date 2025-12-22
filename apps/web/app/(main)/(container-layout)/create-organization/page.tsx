// Components
import { Heading } from '@/components/ui/heading';

// Modules
import { CreateOrganizationForm } from '@/modules/main/create-organizations/create-organization-form';

export default async function CreateOrganizationPage() {
	return (
		<>
			<Heading subtitle="Please enter the information about your organization inside these fields">
				Let&apos;s create new organization
			</Heading>
			<CreateOrganizationForm />
		</>
	);
}
