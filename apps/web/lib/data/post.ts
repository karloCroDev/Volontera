// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

export async function createPost() {
	try {
		const res = await API().post('/post');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
