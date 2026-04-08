// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Schemas
import { RetrieveAlgoPostsSchemaArgs } from '@repo/schemas/home';
import { ServerHandleResponse } from '@repo/types/general';

// Types
import { RetrieveHomePostsResponse } from '@repo/types/home';

export async function retrieveHomePosts({
	limit = 6,
	cursor,
	filter,
}: RetrieveAlgoPostsSchemaArgs): Promise<
	RetrieveHomePostsResponse | ServerHandleResponse<false>
> {
	const query = new URLSearchParams();
	query.set('limit', String(limit));
	if (cursor) query.set('cursor', cursor);
	if (filter) query.set('filter', filter);

	return await serverFetch({
		url: `home/posts?${query.toString()}`,
		init: { cache: 'no-store' },
	});
}
