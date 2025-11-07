// External packages
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';

// Lib
import { additionalInformation, appType } from '@/lib/data/onbaording';

// Repo
import { ErrorFormResponse, SuccessfulResponse } from '@repo/types/general';
import { AppType } from '@repo/types/onbaording';
import { AdditionalFormArgs } from '@repo/schemas/onboarding';

export const useAppType = (
	options?: UseMutationOptions<SuccessfulResponse, ErrorFormResponse, AppType>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['app-type'],
		mutationFn: (values: AppType) => appType(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['onboarding'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useAdditionalInformation = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		AdditionalFormArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['additional-information'],
		mutationFn: (values: AdditionalFormArgs) => additionalInformation(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['onboarding'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
