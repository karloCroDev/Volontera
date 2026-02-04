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
import { CreateCheckoutSessionArgs } from '@repo/schemas/payment';

export const useCheckout = (
	options?: UseMutationOptions<
		GeneratePaymentLinkResponse,
		ErrorToastResponse,
		CreateCheckoutSessionArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['checkout'],
		mutationFn: (data: CreateCheckoutSessionArgs) => checkout(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['payments'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};
