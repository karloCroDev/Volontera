import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';
import { SearchUserArgs } from '@repo/schemas/search';

export async function search(data: SearchUserArgs) {
	try {
		const res = await API().get(`search/${data.query}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
