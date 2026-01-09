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

// Lib
import { cache } from 'react';

// Schemas
import {
	AcceptOrDeclineUsersRequestToJoinOrganizationArgs,
	DemoteOrPromoteOrganizationMemberArgs,
	RetirveAllRequestsToJoinOrganizationArgs,
	RetrieveOrganizationMemberArgs,
	RetrieveAllMembersInOrganizationArgs,
} from '@repo/schemas/organization-managment';
import {
	acceptOrDeclineUsersRequestToJoinOrganization,
	demoteOrPromoteOrganizationMember,
	retrieveAllUsersInOrganization,
	retrieveOrganizationMember,
	retrieveAllRequestsToJoinOrganization,
} from '@/lib/data/organization-managment';
import {
	RetirveAllRequestsToJoinOrganizationResponse,
	RetrieveOrganizationMemberResponse,
} from '@repo/types/organization-managment';
import { ErrorToastResponse, SuccessfulResponse } from '@repo/types/general';

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
			await queryClient.invalidateQueries({
				queryKey: ['organization'],
				exact: false,
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
		UseQueryOptions<RetrieveAllMembersInOrganizationArgs>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery<RetrieveAllMembersInOrganizationArgs>({
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
