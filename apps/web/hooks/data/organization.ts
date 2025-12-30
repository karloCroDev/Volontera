// External packages
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';

// Lib
import { createOrganization } from '@/lib/data/organization';

// Schemas
import { CreateOrganizationArgs } from '@repo/schemas/create-organization';

// Types
import { ErrorFormResponse, SuccessfulResponse } from '@repo/types/general';

export const useCreateOrganization = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		CreateOrganizationArgs
	>
) => {
	console.log('What');
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['create-organization'],
		mutationFn: (data: CreateOrganizationArgs) => createOrganization(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['organization'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
