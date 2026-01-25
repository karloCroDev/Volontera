'use client';

// External packages
import { useParams, useSearchParams } from 'next/navigation';
import * as React from 'react';

// Components
import { Post } from '@/components/ui/post/post';

// Types
import { RetrieveOrganizationPostsResponse } from '@repo/types/post';
import { RetrieveOrganizationPostsQueryArgs } from '@repo/schemas/post';

// Hooks
import { useGetImageFromKeys } from '@/hooks/data/image';
import { useRetrieveOrganizationPosts } from '@/hooks/data/post';
import { useRetrieveOrganizationMember } from '@/hooks/data/organization-managment';

export const PostsMapping: React.FC<{
	posts: RetrieveOrganizationPostsResponse;
}> = ({ posts }) => {
	const params = useParams<{ organizationId: string }>();
	const searchParams = useSearchParams();
	const rawFilter = searchParams.get('filter');
	const filter: RetrieveOrganizationPostsQueryArgs['filter'] =
		rawFilter === 'recommended' ||
		rawFilter === 'newest' ||
		rawFilter === 'oldest'
			? rawFilter
			: undefined;

	const { data } = useRetrieveOrganizationPosts(params.organizationId, filter, {
		initialData: posts,
	});

	const { data: imagesData } = useGetImageFromKeys({
		imageUrls: [
			...data.posts.flatMap((post) =>
				post.postImages.map((image) => image.imageUrl)
			),
			...data.posts.map((post) => post.organization.avatarImage),
			...data.posts
				.map((post) => post.author.image)
				.filter((url) => url != null),
		],
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
				images={imagesData?.urls}
			/>
		))
	) : (
		<p className="text-muted-foreground col-span-2 text-center">
			No posts have been created yet.
		</p>
	);
};
