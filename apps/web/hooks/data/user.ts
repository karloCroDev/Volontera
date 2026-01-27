// External packages
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
	UseQueryOptions,
} from '@tanstack/react-query';
import { UserSchemaArgs } from '@repo/schemas/user';

// Lib
import {
	clientSession,
	logout,
	getUserById,
	retrieveAllOrganizationsForUser,
	retrieveAllPostsForUser,
} from '@/lib/data/user';

// Types
import {
	UserResponse,
	RetrieveOrganizationUserResponse,
	RetrievePostsUserResponse,
} from '@repo/types/user';
import { ServerHandleResponse } from '@repo/types/general';
import { User } from '../../../../packages/database/generated/prisma';

export const useSession = () => {
	return useQuery<UserResponse, ServerHandleResponse<false>>({
		queryKey: ['session'],
		queryFn: clientSession,
		staleTime: 5 * 60 * 1000,
	});
};

export const useLogout = (options?: UseMutationOptions<void, Error, void>) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['logout'],
		mutationFn: () => logout(),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useGetUser = ({ userId }: UserSchemaArgs) => {
	return useQuery<UserResponse, ServerHandleResponse<false>>({
		queryKey: [userId],
		queryFn: () => getUserById({ userId }),
	});
};

export const useRetrieveAllOrganizationsForUser = (
	userId: UserSchemaArgs['userId'],
	options?: Omit<
		UseQueryOptions<RetrieveOrganizationUserResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery<RetrieveOrganizationUserResponse>({
		queryKey: ['organizations', userId],
		queryFn: () => retrieveAllOrganizationsForUser({ userId }),
		...options,
	});
};

export const useRetrieveAllPostsForUser = (
	userId: UserSchemaArgs['userId'],
	options?: Omit<
		UseQueryOptions<RetrievePostsUserResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery<RetrievePostsUserResponse>({
		queryKey: ['posts', userId],
		queryFn: () => retrieveAllPostsForUser({ userId }),
		...options,
	});
};
