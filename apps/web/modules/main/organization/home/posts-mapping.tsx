'use client';

// External packages
import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';

// Components
import { Post } from '@/components/ui/post/post';

// Types
import { RetrieveOrganizationPostsResponse } from '@repo/types/post';
import { RetrieveOrganizationPostsQueryArgs } from '@repo/schemas/post';

// Hooks
import { useRetrieveOrganizationPosts } from '@/hooks/data/post';
import { useRetrieveOrganizationMember } from '@/hooks/data/organization-managment';

export const PostsMapping: React.FC<{
	posts: RetrieveOrganizationPostsResponse;
}> = ({ posts }) => {
	const params = useParams<{ organizationId: string }>();
	const searchParams = useSearchParams();
	const rawFilter = searchParams.get('filter');
	const filter: RetrieveOrganizationPostsQueryArgs['filter'] = React.useMemo(
		() =>
			rawFilter === 'recommended' ||
			rawFilter === 'newest' ||
			rawFilter === 'oldest'
				? rawFilter
				: undefined,
		[rawFilter]
	);

	const { data } = useRetrieveOrganizationPosts(params.organizationId, filter, {
		initialData: posts,
	});

	const { data: member } = useRetrieveOrganizationMember({
		organizationId: params.organizationId,
	});
	return data.posts.length > 0 ? (
		data.posts.map((post) => (
			<Post
				key={post.id}
				post={post}
				isInsideOrganization
				// TODO: Only organization admins can delete posts handle this!
				hasAnAdminAccess={
					member?.organizationMember.role === 'OWNER' ||
					member?.organizationMember.role === 'ADMIN'
				}
			/>
		))
	) : (
		<p className="text-muted-foreground col-span-2 text-center">
			No posts have been created yet.
		</p>
	);
};
