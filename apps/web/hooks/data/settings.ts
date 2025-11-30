// External packages
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';

// Data
import { changeProfileInfo, resetPasswordInApp } from '@/lib/data/settings';

//
import { ErrorFormResponse, SuccessfulResponse } from '@repo/types/general';
import { SettingsArgs } from '@repo/schemas/settings';
import { ResetPasswordSettingsArgs } from '@repo/schemas/settings';

export const useChangeProfileInfo = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		SettingsArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['register'],
		mutationFn: (data: SettingsArgs) => changeProfileInfo(data),
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
		mutationKey: ['register'],
		mutationFn: (data: ResetPasswordSettingsArgs) => resetPasswordInApp(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
