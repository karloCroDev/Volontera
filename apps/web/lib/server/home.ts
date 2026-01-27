// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Schemas
import { RetrieveAlgoPostsSchemaArgs } from '@repo/schemas/home';
import { ServerHandleResponse } from '@repo/types/general';

// Types
import { RetrieveHomePostsResponse } from '@repo/types/home';

export async function retrieveHomePosts({
	limit = 6,
	offset = 0,
	filter,
}: RetrieveAlgoPostsSchemaArgs): Promise<
	RetrieveHomePostsResponse | ServerHandleResponse<false>
> {
	const query = new URLSearchParams();
	query.set('limit', String(limit));
	query.set('offset', String(offset));
	if (filter) query.set('filter', filter);

	return await serverFetch({
		url: `home/posts?${query.toString()}`,
		init: { cache: 'no-store' },
	});
}
