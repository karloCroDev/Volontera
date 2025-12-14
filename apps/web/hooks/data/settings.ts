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

// Repo
import { ErrorFormResponse, SuccessfulResponse } from '@repo/types/general';
import {
	SettingsArgs,
	ResetPasswordSettingsArgs,
} from '@repo/schemas/settings';
import { DataWithFile } from '@repo/types/upload';

export const useChangeProfileInfo = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		DataWithFile<SettingsArgs>
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		// use a distinct key for this mutation
		mutationKey: ['settings', 'changeProfile'],
		// mutation receives a single variable object { data, file }
		mutationFn: (vars: DataWithFile<SettingsArgs>) =>
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
