// External packages
import { cache } from 'react';
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { UserSchemaArgs } from '@repo/schemas/user';

// Lib
import { clientSession, logout, getUserById } from '@/lib/data/user';

// Types
import { UserResponse } from '@repo/types/user';
import { ServerHandleResponse } from '@repo/types/general';

export const useSession = () => {
	return useQuery<UserResponse, ServerHandleResponse<false>>({
		queryKey: ['session'],
		queryFn: cache(clientSession),
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

export const useRetrieveAllOrganizationsForUser = ({
	userId,
}: UserSchemaArgs) => {
	return useQuery<UserResponse, ServerHandleResponse<false>>({
		queryKey: ['organizations', userId],
		queryFn: () => getUserById({ userId }),
	});
};

export const useRetrieveAllPostsForUser = ({ userId }: UserSchemaArgs) => {
	return useQuery<UserResponse, ServerHandleResponse<false>>({
		queryKey: ['posts', userId],
		queryFn: () => getUserById({ userId }),
	});
};
