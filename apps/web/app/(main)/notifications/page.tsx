// Components
import { Heading } from '@/components/ui/heading';

// Modules
import { NotificationSandbox } from '@/modules/main/notifications/NotificationSandbox';

export default async function Notifications() {
	return (
		<>
			<Heading subtitle="See all recent activities you might have missed out!">
				Notifications
			</Heading>

			<NotificationSandbox />
		</>
	);
}
