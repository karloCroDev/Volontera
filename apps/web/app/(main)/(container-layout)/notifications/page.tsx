// Components
import { Heading } from '@/components/ui/heading';
import { dehydrate, QueryClient } from '@tanstack/react-query';

// Lib
import {
	getMarkAllNotificationsAsRead,
	getUsersNotifications,
} from '@/lib/server/notification';

// Modules
import { NotificationSandbox } from '@/modules/main/notifications/notification-sandbox';

export default async function Notifications() {
	const notifications = await getUsersNotifications();
	const queryClient = new QueryClient();

	if (notifications.success) {
		queryClient.setQueryData(['notifications'], notifications);
	}

	const dehydratedState = dehydrate(queryClient);
	await getMarkAllNotificationsAsRead(); // Svaki put kad se otvori notifikacijski page, sve notifikacije se oznace kao procitane (nece biti odmah prikazane kao procitane na UI-u samo updateam)

	return (
		<>
			<Heading subtitle="See all recent activities you might have missed out!">
				Notifications
			</Heading>

			{notifications.success ? (
				<NotificationSandbox dehydratedState={dehydratedState} />
			) : (
				<p className="text-muted-foreground mt-10">
					Failed to load notifications.
				</p>
			)}
		</>
	);
}
