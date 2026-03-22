// External pakcages
import axios from 'axios';

export function catchError(err: unknown) {
	const message = axios.isAxiosError(err)
		? err.response?.data?.message || err.message || 'Request failed'
		: err instanceof Error
			? err.message
			: 'Unknown error';
	throw new Error(message);
}
