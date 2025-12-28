// External packages
import { cache } from 'react';
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';

// Lib
import { clientSession, logout, getUserById } from '@/lib/data/user';

// Types
import { SessionSuccessResponse } from '@repo/types/auth';
import { ServerHandleResponse } from '@repo/types/general';

export const useSession = () => {
	return useQuery<SessionSuccessResponse, ServerHandleResponse<false>>({
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

export const useGetUser = (userId: string) => {
	return useQuery<SessionSuccessResponse, ServerHandleResponse<false>>({
		queryKey: [userId],
		queryFn: () => getUserById(userId),
	});
};
