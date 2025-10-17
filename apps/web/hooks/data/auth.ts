// External packages
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { cache } from 'react';

// Lib
import {
	clientSession,
	forgotPassword,
	login,
	logout,
	register,
	resetPassword,
	verifyEmail,
} from '@/lib/data/auth';

// Schemas
import {
	ForgotPasswordArgs,
	LoginArgs,
	RegisterArgs,
	ResetPasswordArgs,
	VerifyEmailArgs,
} from '@repo/schemas/auth';

// Types
import {
	AuthResponse,
	ErrorAuthResponse,
	SessionSuccessResponse,
} from '@repo/types/auth';

export const useSession = () => {
	return useQuery({
		queryKey: ['session'],
		queryFn: cache(clientSession),
		staleTime: 5 * 60 * 1000,
	});
};

export const useLogin = (
	options?: UseMutationOptions<AuthResponse, ErrorAuthResponse, LoginArgs>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['login'],
		mutationFn: (values: LoginArgs) => login(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useRegister = (
	options?: UseMutationOptions<AuthResponse, ErrorAuthResponse, RegisterArgs>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['register'],
		mutationFn: (values: RegisterArgs) => register(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
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

export const useForgotPassword = (
	options?: UseMutationOptions<
		SessionSuccessResponse,
		Error,
		ForgotPasswordArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['forgot-password'],
		mutationFn: (values: ForgotPasswordArgs) => forgotPassword(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useResetPassword = (
	options?: UseMutationOptions<SessionSuccessResponse, Error, ResetPasswordArgs>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['reset-password'],
		mutationFn: (values: ResetPasswordArgs) => resetPassword(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useVerifyEmail = (
	options?: UseMutationOptions<SessionSuccessResponse, Error, VerifyEmailArgs>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['verify-email'],
		mutationFn: (values: VerifyEmailArgs) => verifyEmail(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
