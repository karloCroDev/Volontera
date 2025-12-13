// Lib
import { serverFetch } from '@/lib/utils/server-fetch';
import { ServerHandleResponse } from '@repo/types/general';

// Types
import { NotificationResponse } from '@repo/types/notification';

export async function getUsersNotifications(): Promise<
	NotificationResponse | ServerHandleResponse<false>
> {
	return await serverFetch({
		url: 'notifications',
		init: { next: { tags: ['notification-user'] }, cache: 'no-store' },
	});
}

export async function getMarkAllNotificationsAsRead() {
	return await serverFetch({
		url: 'notifications/read',
		init: { next: { tags: ['notification-read'] }, cache: 'no-store' },
	});
}
