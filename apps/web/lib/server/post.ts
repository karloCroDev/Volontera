// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Schemas
import {
	RetrievePostWithCommentsArgs,
	RetrieveOrganizationPostsArgs,
} from '@repo/schemas/post';

// Types
import {
	RetrieveOrganizationPostsResponse,
	RetrievePostWithComments,
} from '@repo/types/post';

export async function retrieveOrganizationPosts({
	organizationId,
}: RetrieveOrganizationPostsArgs): Promise<RetrieveOrganizationPostsResponse> {
	return await serverFetch({
		url: `/post/${organizationId}`,
		init: { next: { tags: ['organization-posts'] } },
	});
}
export async function retrievePostWithComments({
	postId,
}: RetrievePostWithCommentsArgs): Promise<RetrievePostWithComments> {
	return await serverFetch({
		url: `/post/id/${postId}`,
		init: { next: { tags: ['post-comments'] } },
	});
}
