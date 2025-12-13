// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';
import {
	CreateNotificationArgs,
	NotificationIdsArgs,
} from '@repo/schemas/notification';

export async function hasUnreadMessages() {
	try {
		const res = await API().get('notifications/unread');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function getUsersNotifications() {
	try {
		const res = await API().get('notifications');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

// Probably won't be used (will be used inside some other api) but just in case
export async function createNotification(data: CreateNotificationArgs) {
	try {
		const res = await API().post('notifications', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteNotifications(data: NotificationIdsArgs) {
	try {
		const res = await API().delete('notifications', { data });
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function markAllNotificationsAsRead() {
	try {
		const res = await API().get('notifications/read');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
