// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Schemas
import {
	RetrievePostArgs,
	RetrieveOrganizationPostsArgs,
	RetrieveOrganizationPostsQueryArgs,
} from '@repo/schemas/post';
import { ServerHandleResponse } from '@repo/types/general';

// Types
import {
	RetrieveOrganizationPostsResponse,
	RetrievePostWithComments,
} from '@repo/types/post';

export async function retrieveOrganizationPosts(
	organizationId: RetrieveOrganizationPostsArgs['organizationId'],
	filter?: RetrieveOrganizationPostsQueryArgs['filter']
): Promise<RetrieveOrganizationPostsResponse | ServerHandleResponse<false>> {
	const url = filter
		? `post/${organizationId}?filter=${encodeURIComponent(filter)}`
		: `post/${organizationId}`;
	return await serverFetch({
		url,
		init: {
			next: { tags: ['organization-posts'] },
			cache: 'no-store',
		},
	});
}
export async function retrievePostWithComments({
	postId,
}: RetrievePostArgs): Promise<
	RetrievePostWithComments | ServerHandleResponse<false>
> {
	return await serverFetch({
		url: `post/id/${postId}`,
		init: { next: { tags: ['post-comments'] }, cache: 'no-store' },
	});
}
