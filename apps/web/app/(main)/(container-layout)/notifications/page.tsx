// Components
import { Heading } from '@/components/ui/heading';
import {
	getMarkAllNotificationsAsRead,
	getUsersNotifications,
} from '@/lib/server/notification';

// Modules
import { NotificationSandbox } from '@/modules/main/notifications/notification-sandbox';

export default async function Notifications() {
	const [notifications, markAsRead] = await Promise.all([
		getUsersNotifications(),
		getMarkAllNotificationsAsRead(),
	]);

	// On each loading of the notifications page, I am marking all notifications as read
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
