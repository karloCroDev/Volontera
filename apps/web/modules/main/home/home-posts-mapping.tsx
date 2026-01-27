'use client';

// External packages
import * as React from 'react';
import { InfiniteData } from '@tanstack/react-query';

// Components
import { Post } from '@/components/ui/post/post';
import { PostSkeleton } from '@/components/ui/post/post-skeleton';

// Hooks
import { useInfiniteHomePosts } from '@/hooks/data/home';
import { useGetImageFromKeys } from '@/hooks/data/image';
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { useSearchParams } from 'next/navigation';

// Types
import { RetrieveHomePostsResponse } from '@repo/types/home';

export const HomePostsMapping = withReactQueryProvider(
	({
		initialData,
	}: {
		initialData?: InfiniteData<RetrieveHomePostsResponse, number>;
	}) => {
		const seachParams = useSearchParams();
		const filterParam = seachParams.get('filter');
		const filter = filterParam === 'following' ? 'following' : undefined;

		const query = useInfiniteHomePosts({
			data: {
				filter,
				limit: 6,
				offset: 0,
			},
			options: initialData
				? {
						initialData,
						staleTime: 30_000,
					}
				: undefined,
		});

		const posts = query.data?.pages.flatMap((p) => p.posts) ?? [];

		const loadMoreRef = React.useRef<HTMLDivElement>(null);
		React.useEffect(() => {
			if (!loadMoreRef.current) return;
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0]?.isIntersecting && query.hasNextPage) {
						query.fetchNextPage();
					}
				},
				{ rootMargin: '150px' }
			);

			observer.observe(loadMoreRef.current);
			return () => observer.disconnect();
		}, [query, loadMoreRef]);

		const { data: imagesData } = useGetImageFromKeys({
			imageUrls: [
				...posts.flatMap((post) =>
					post.postImages.map((image) => image.imageUrl)
				),
				...posts.map((post) => post.organization.avatarImage),
				...posts.map((post) => post.author.image).filter((url) => url != null),
			],
		});

		if (query.isError) {
			return (
				<p className="text-muted-foreground mt-6 text-center">
					Failed to load posts.
				</p>
			);
		}

		return (
			<>
				<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
					{posts.length > 0 ? (
						posts.map((post) => (
							<Post key={post.id} post={post} images={imagesData?.urls} />
						))
					) : (
						<p className="text-muted-foreground text-center xl:col-span-2">
							No posts found.
						</p>
					)}

					{query.isPending &&
						[...Array(6)].map((_, index) => <PostSkeleton key={index} />)}

					{query.isFetchingNextPage &&
						[...Array(2)].map((_, indx) => <PostSkeleton key={indx} />)}
				</div>

				{!query.hasNextPage && posts.length > 0 ? (
					<p className="text-muted-foreground mt-6 text-center">
						No more posts.
					</p>
				) : null}
				{query.hasNextPage && <div ref={loadMoreRef} />}
			</>
		);
	}
);
