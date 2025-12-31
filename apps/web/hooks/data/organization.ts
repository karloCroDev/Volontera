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
import { ErrorFormResponse } from '@repo/types/general';
import { CreateOrganizationResponse } from '@repo/types/organization';

export const useCreateOrganization = (
	options?: UseMutationOptions<
		CreateOrganizationResponse,
		ErrorFormResponse,
		CreateOrganizationArgs
	>
) => {
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
