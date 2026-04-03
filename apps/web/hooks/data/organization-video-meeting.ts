// External packages
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
	UseQueryOptions,
} from '@tanstack/react-query';

// Lib
import {
	endOrganizationVideoMeeting,
	joinOrganizationVideoMeeting,
	leaveOrganizationVideoMeeting,
	retrieveOrganizationVideoMeetingState,
	startOrganizationVideoMeeting,
} from '@/lib/data/organization-video-meeting';

// Types
import { ErrorToastResponse } from '@repo/types/general';
import {
	OrganizationVideoMeetingJoinResponse,
	OrganizationVideoMeetingLeaveResponse,
	OrganizationVideoMeetingState,
} from '@repo/types/organizaton-video-meeting';

export const useRetrieveOrganizationVideoMeetingState = (
	organizationId: string,
	options?: Omit<
		UseQueryOptions<OrganizationVideoMeetingState, ErrorToastResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery<OrganizationVideoMeetingState, ErrorToastResponse>({
		queryKey: ['organization-video-meeting', organizationId],
		queryFn: () => retrieveOrganizationVideoMeetingState(organizationId),
		...options,
	});
};

export const useStartOrganizationVideoMeeting = (
	options?: UseMutationOptions<
		OrganizationVideoMeetingJoinResponse,
		ErrorToastResponse,
		string
	>
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['organization-video-meeting-start'],
		mutationFn: (organizationId: string) =>
			startOrganizationVideoMeeting(organizationId),
		onSuccess: async (data, ...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization-video-meeting'],
				exact: false,
			});
			await options?.onSuccess?.(data, ...args);
		},
		...options,
	});
};

export const useJoinOrganizationVideoMeeting = (
	options?: UseMutationOptions<
		OrganizationVideoMeetingJoinResponse,
		ErrorToastResponse,
		string
	>
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['organization-video-meeting-join'],
		mutationFn: (organizationId: string) =>
			joinOrganizationVideoMeeting(organizationId),
		onSuccess: async (data, ...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization-video-meeting'],
				exact: false,
			});
			await options?.onSuccess?.(data, ...args);
		},
		...options,
	});
};

export const useLeaveOrganizationVideoMeeting = (
	options?: UseMutationOptions<
		OrganizationVideoMeetingLeaveResponse,
		ErrorToastResponse,
		string
	>
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['organization-video-meeting-leave'],
		mutationFn: (organizationId: string) =>
			leaveOrganizationVideoMeeting(organizationId),
		onSuccess: async (data, ...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization-video-meeting'],
				exact: false,
			});
			await options?.onSuccess?.(data, ...args);
		},
		...options,
	});
};

export const useEndOrganizationVideoMeeting = (
	options?: UseMutationOptions<
		OrganizationVideoMeetingLeaveResponse,
		ErrorToastResponse,
		string
	>
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['organization-video-meeting-end'],
		mutationFn: (organizationId: string) =>
			endOrganizationVideoMeeting(organizationId),
		onSuccess: async (data, ...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization-video-meeting'],
				exact: false,
			});
			await options?.onSuccess?.(data, ...args);
		},
		...options,
	});
};
