// External packages
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';

// Data
import {
	changeProfileInfo,
	deleteAccount,
	resetPasswordInApp,
} from '@/lib/data/settings';

//
import { ErrorFormResponse, SuccessfulResponse } from '@repo/types/general';
import {
	SettingsArgs,
	ResetPasswordSettingsArgs,
} from '@repo/schemas/settings';

// Add a small local type so mutation can receive both data and an optional file
export type ChangeProfileArgs = { data: SettingsArgs; file?: File };

export const useChangeProfileInfo = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		ChangeProfileArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		// use a distinct key for this mutation
		mutationKey: ['settings', 'changeProfile'],
		// mutation receives a single variable object { data, file }
		mutationFn: (vars: ChangeProfileArgs) =>
			changeProfileInfo({ data: vars.data, file: vars.file }),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
export const useResetPasswordInApp = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		ResetPasswordSettingsArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		// distinct key for reset password
		mutationKey: ['settings', 'resetPassword'],
		mutationFn: (data: ResetPasswordSettingsArgs) => resetPasswordInApp(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
export const useDeleteAccount = (
	options?: UseMutationOptions<SuccessfulResponse, ErrorFormResponse, void>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		// distinct key for reset password
		mutationKey: ['settings', 'resetPassword'],
		mutationFn: deleteAccount,
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
