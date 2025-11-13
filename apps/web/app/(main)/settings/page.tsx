// Components
import { Heading } from '@/components/ui/heading';

// Modules
import { FormWrapper } from '@/modules/main/settings/form-wrapper';

export default async function SettingsPage() {
	return (
		<>
			<Heading subtitle="Change apperance and add more informaton about yourself">
				Settings
			</Heading>
			<FormWrapper />
		</>
	);
}
