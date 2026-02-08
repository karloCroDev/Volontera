'use client';

// External packages
import * as React from 'react';
import { useSearchParams } from 'next/navigation';

// Components
import { Post } from '@/components/ui/post/post';
import { PostSkeleton } from '@/components/ui/post/post-skeleton';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

// Hooks
import { useInfiniteHomePosts } from '@/hooks/data/home';

export const HomePostsMapping = withReactQueryProvider(() => {
	const seachParams = useSearchParams();
	const filterParam = seachParams.get('filter');
	const filter = filterParam === 'following' ? 'following' : undefined;

	const query = useInfiniteHomePosts(
		{
			filter,
			limit: 6,
			offset: 0,
		},
		{}
	);

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
			{ rootMargin: '300px' }
		);

		observer.observe(loadMoreRef.current);
		return () => observer.disconnect();
	}, [query, loadMoreRef]);

	if (query.isError) {
		return (
			<p className="text-muted-foreground mt-6 text-center">
				Failed to load posts.
			</p>
		);
	}

	return (
		<>
			{posts.length > 0 ? (
				posts.map((post) => <Post key={post.id} post={post} />)
			) : (
				<p className="text-muted-foreground text-center xl:col-span-2">
					No posts found.
				</p>
			)}

			{query.isPending &&
				[...Array(6)].map((_, index) => <PostSkeleton key={index} />)}

			{query.isFetchingNextPage &&
				[...Array(2)].map((_, indx) => <PostSkeleton key={indx} />)}

			{!query.hasNextPage && posts.length > 0 ? (
				<p className="text-muted-foreground mt-6 text-center xl:col-span-2">
					No more posts.
				</p>
			) : null}
			{query.hasNextPage && <div ref={loadMoreRef} />}
		</>
	);
});
