import { Heading } from '@/components/ui/heading';
import { FormWrapper } from '@/modules/main/settings/form-wrapper';
import { ProfileForm } from '@/modules/main/settings/profile-form';

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
