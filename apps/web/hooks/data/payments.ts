// External packages
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';

// Lib
import { checkout } from '@/lib/data/payments';

// Types
import { ErrorToastResponse } from '@repo/types/general';
import { GeneratePaymentLinkResponse } from '@repo/types/payment';

export const useCheckout = (
	options?: UseMutationOptions<
		GeneratePaymentLinkResponse,
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
