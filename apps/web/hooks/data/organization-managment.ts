// External packages
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
	UseQueryOptions,
	useSuspenseQuery,
	UseSuspenseQueryOptions,
} from '@tanstack/react-query';

// Schemas
import {
	AcceptOrDeclineUsersRequestToJoinOrganizationArgs,
	DeleteOrganizationArgs,
	DemoteOrPromoteOrganizationMemberArgs,
	RemoveOrganizationMemberArgs,
	RetirveAllRequestsToJoinOrganizationArgs,
	RetrieveOrganizationMemberArgs,
	RetrieveAllMembersInOrganizationArgs,
	LeaveOrganizationArgs,
} from '@repo/schemas/organization-managment';
import { UpdateOrganizationArgs } from '@repo/schemas/organization-managment';

// Lib
import {
	acceptOrDeclineUsersRequestToJoinOrganization,
	deleteOrganization,
	demoteOrPromoteOrganizationMember,
	retrieveAllUsersInOrganization,
	removeOrganizationMember,
	retrieveOrganizationMember,
	retrieveAllRequestsToJoinOrganization,
	leaveOrganization,
	updateOrganization,
} from '@/lib/data/organization-managment';

// Types
import {
	RetirveAllRequestsToJoinOrganizationResponse,
	RetrieveAllMembersInOrganizationResponse,
	RetrieveOrganizationMemberResponse,
	UpdateOrganizationResponse,
} from '@repo/types/organization-managment';
import {
	ErrorFormResponse,
	ErrorToastResponse,
	SuccessfulResponse,
} from '@repo/types/general';
import { DataWithFiles } from '@repo/types/upload';

export const useAcceptOrDeclineUsersRequestToJoinOrganization = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		AcceptOrDeclineUsersRequestToJoinOrganizationArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['accept-or-decline-request'],
		mutationFn: (data: AcceptOrDeclineUsersRequestToJoinOrganizationArgs) =>
			acceptOrDeclineUsersRequestToJoinOrganization(data),
		onSuccess: async (...args) => {
			const [, variables] = args;
			await queryClient.invalidateQueries({
				queryKey: ['organization'],
				exact: false,
			});
			await queryClient.invalidateQueries({
				queryKey: ['organization-join-requests', variables.organizationId],
			});
			await queryClient.invalidateQueries({
				queryKey: ['organization-users', variables.organizationId],
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useDemoteOrPromoteOrganizationMember = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DemoteOrPromoteOrganizationMemberArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['accept-or-decline-request'],
		mutationFn: (data: DemoteOrPromoteOrganizationMemberArgs) =>
			demoteOrPromoteOrganizationMember(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization'],
				exact: false,
			});
			await queryClient.invalidateQueries({
				queryKey: ['organization-users', args[1].organizationId],
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useRemoveOrganizationMember = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		RemoveOrganizationMemberArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['remove-organization-member'],
		mutationFn: (data: RemoveOrganizationMemberArgs) =>
			removeOrganizationMember(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization'],
				exact: false,
			});
			await queryClient.invalidateQueries({
				queryKey: ['organization-users', args[1].organizationId],
			});
			await queryClient.invalidateQueries({
				queryKey: ['organization-join-requests', args[1].organizationId],
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useUpdateOrganization = (
	options?: UseMutationOptions<
		UpdateOrganizationResponse,
		ErrorFormResponse,
		DataWithFiles<UpdateOrganizationArgs>
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['update-organization'],
		mutationFn: (data: DataWithFiles<UpdateOrganizationArgs>) =>
			updateOrganization(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useRetrieveOrganizationMember = (
	data: RetrieveOrganizationMemberArgs,
	options?: Omit<
		UseQueryOptions<RetrieveOrganizationMemberResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery<RetrieveOrganizationMemberResponse>({
		queryKey: ['organization-member', data.organizationId],
		queryFn: () => retrieveOrganizationMember(data),
		...options,
	});
};

export const useRetrieveAllMembersInOrganization = (
	data: RetrieveAllMembersInOrganizationArgs,
	options?: Omit<
		UseSuspenseQueryOptions<RetrieveAllMembersInOrganizationResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery<RetrieveAllMembersInOrganizationResponse>({
		queryKey: ['organization-users', data.organizationId],
		queryFn: () => retrieveAllUsersInOrganization(data),
		...options,
	});
};

export const useRetirveAllRequestsToJoinOrganization = (
	data: RetirveAllRequestsToJoinOrganizationArgs,
	options?: Omit<
		UseSuspenseQueryOptions<RetirveAllRequestsToJoinOrganizationResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery<RetirveAllRequestsToJoinOrganizationResponse>({
		queryKey: ['organization-join-requests', data.organizationId],
		queryFn: () => retrieveAllRequestsToJoinOrganization(data),
		...options,
	});
};

export const useLeaveOrganization = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		LeaveOrganizationArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['leave-organization'],
		mutationFn: (data: LeaveOrganizationArgs) => leaveOrganization(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useDeleteOrganization = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeleteOrganizationArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['delete-organization'],
		mutationFn: (data: DeleteOrganizationArgs) => deleteOrganization(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
