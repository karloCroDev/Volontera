// Components
import { Heading } from '@/components/ui/heading';
import { getSession } from '@/lib/server/user';

// Modules
import { FormWrapper } from '@/modules/main/settings/form-wrapper';

export default async function SettingsPage() {
	const user = await getSession();
	return (
		<>
			<Heading subtitle="Change apperance and add more informaton about yourself">
				Settings
			</Heading>
			{user.success && <FormWrapper user={user} />}
		</>
	);
}
