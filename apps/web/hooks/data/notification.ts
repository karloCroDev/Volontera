// External packages
import {
	ErrorFormResponse,
	ErrorToastResponse,
	SuccessfulResponse,
} from '@repo/types/general';
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
	useSuspenseQuery,
	UseSuspenseQueryOptions,
} from '@tanstack/react-query';

// Lib
import {
	createNotification,
	deleteNotifications,
	getUsersNotifications,
	hasUnreadMessages,
} from '@/lib/data/notification';

// Schemas
import {
	CreateNotificationArgs,
	NotificationIdsArgs,
} from '@repo/schemas/notification';

export const useGetUsersNotifications = (
	options?: Omit<UseSuspenseQueryOptions<boolean>, 'queryKey' | 'queryFn'>
) => {
	return useSuspenseQuery({
		queryKey: ['notifications'],
		queryFn: getUsersNotifications,
		...options,
	});
};
export const useHasUnreadMessages = () => {
	return useSuspenseQuery({
		queryKey: ['has-unread-notifications'],
		queryFn: hasUnreadMessages,
	});
};

export const useCreateNotification = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		CreateNotificationArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['add-notification'],
		mutationFn: (values: CreateNotificationArgs) => createNotification(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['notifications'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useDeleteHelpConversation = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		NotificationIdsArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['delete-notifications'],
		mutationFn: (values: NotificationIdsArgs) => deleteNotifications(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['notifications'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
