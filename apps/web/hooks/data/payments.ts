// External packages
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';

// Lib
import { checkout } from '@/lib/data/payments';

// Types
import { ErrorToastResponse, SuccessfulResponse } from '@repo/types/general';

export const useCheckout = (
	options?: UseMutationOptions<
		SuccessfulResponse & { url: string },
		ErrorToastResponse,
		string
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['skip-additional-information'],
		mutationFn: (priceId: string) => checkout(priceId),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['payments'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
