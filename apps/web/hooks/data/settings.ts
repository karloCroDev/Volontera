// External packages
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';

// Data
import { updateUser } from '@/lib/data/settings';

// Types
import { SettingsResponse } from '@repo/types/settings';

// Schemas
import { SettingsArgs } from '@repo/schemas';

export type UpdateUserFetch = {
	data: SettingsArgs;
	file?: File;
};
export const useUpdateUser = (
	options?: UseMutationOptions<SettingsResponse, Error, UpdateUserFetch>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['register'],
		mutationFn: ({ data, file }: UpdateUserFetch) => updateUser({ data, file }),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
