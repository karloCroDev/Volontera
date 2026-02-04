// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';
import { CreateCheckoutSessionArgs } from '@repo/schemas/payment';

export async function checkout(data: CreateCheckoutSessionArgs) {
	try {
		const res = await API().post('payment/checkout', undefined, {
			params: {
				priceId: data.priceId,
			},
		});
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
export async function billing() {
	try {
		const res = await API().get('payment/billing');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
