// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

export async function checkout(priceId: string) {
	try {
		const res = await API({
			headers: {
				'Content-Type': 'text/plain',
			},
		}).post('payment/checkout', priceId);
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
