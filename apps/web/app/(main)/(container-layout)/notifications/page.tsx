// Components
import { Heading } from '@/components/ui/heading';
import {
	getMarkAllNotificationsAsRead,
	getUsersNotifications,
} from '@/lib/server/notification';

// Modules
import { NotificationSandbox } from '@/modules/main/notifications/notification-sandbox';

export default async function Notifications() {
	const notifications = await getUsersNotifications();

	await getMarkAllNotificationsAsRead(); // Svaki put kad se otvori notifikacijski page, sve notifikacije se oznace kao procitane (nece biti odmah prikazane kao procitane na UI-u samo updateam)

	// Ako bude vremena dodaj
	return (
		<>
			<Heading subtitle="See all recent activities you might have missed out!">
				Notifications
			</Heading>

			{notifications.success ? (
				<NotificationSandbox notifications={notifications.notifications} />
			) : (
				<p className="text-muted-foreground mt-10">
					Failed to load notifications.
				</p>
			)}
		</>
	);
}
