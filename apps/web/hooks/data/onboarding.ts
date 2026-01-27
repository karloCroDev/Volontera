// External packages
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';

// Lib
import {
	additionalInformation,
	appType,
	skipAdditionalInformation,
} from '@/lib/data/onboarding';

// Repo
import { ErrorFormResponse, SuccessfulResponse } from '@repo/types/general';
import { DataWithFile } from '@repo/types/upload';
import {
	AdditionalFormArgs,
	AppTypeSchemaArgs,
} from '@repo/schemas/onboarding';

export const useAppType = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		AppTypeSchemaArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['app-type'],
		mutationFn: (values: AppTypeSchemaArgs) => appType(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['onboarding'] });
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useAdditionalInformation = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		DataWithFile<AdditionalFormArgs>
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['additional-information'],
		mutationFn: (values: DataWithFile<AdditionalFormArgs>) =>
			additionalInformation(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['onboarding'] });
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useSkipAdditionalInformation = (
	options?: UseMutationOptions<SuccessfulResponse, ErrorFormResponse, undefined>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['skip-additional-information'],
		mutationFn: skipAdditionalInformation,
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['onboarding'] });
			await queryClient.invalidateQueries({ queryKey: ['session'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
