// External pakcages
import axios from 'axios';

export function catchError(err: unknown) {
	const message =
		err instanceof Error
			? err.message
			: axios.isAxiosError(err)
				? err.response?.data?.message || 'Request failed'
				: 'Unknown error';
	throw new Error(message);
}
