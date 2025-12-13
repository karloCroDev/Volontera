// Components
import { Heading } from '@/components/ui/heading';
import {
	getMarkAllNotificationsAsRead,
	getUsersNotifications,
} from '@/lib/server/notification';

// Modules
import { NotificationSandbox } from '@/modules/main/notifications/NotificationSandbox';

export default async function Notifications() {
	const notifications = await getUsersNotifications();
	console.log(notifications);
	// On each loading of the notifications page, I am marking all notifications as read
	const markAsRead = await getMarkAllNotificationsAsRead();
	console.log(markAsRead);
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
