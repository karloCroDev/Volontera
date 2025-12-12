// Lib
import { serverFetch } from '@/lib/utils/server-fetch';
import { ServerHandleResponse } from '@repo/types/general';

// Types
import { GeneratePaymentLinkResponse } from '@repo/types/payment';

export async function getBillingLink(): Promise<
	GeneratePaymentLinkResponse | ServerHandleResponse<false>
> {
	return await serverFetch({
		url: 'payment/billing',
		init: { next: { tags: ['payment'] } },

		// Forche cache!
	});
}
