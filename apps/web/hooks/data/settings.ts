// External packages
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';

// Data
import { changeProfileInfo } from '@/lib/data/settings';

//
import { ErrorFormResponse, SuccessfulResponse } from '@repo/types/general';
import { SettingsArgs } from '@repo/schemas/settings';

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
