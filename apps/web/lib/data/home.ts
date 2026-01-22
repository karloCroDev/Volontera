// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import { RetrieveAlgoPostsSchemaArgs } from '@repo/schemas/home';

export async function retrieveRecentAlgoHomePosts({
	limit = 10,
	offset = 0,
	filter,
}: RetrieveAlgoPostsSchemaArgs) {
	try {
		const res = await API().get(`/home/posts`, {
			params: { limit, offset, filter },
		});
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
