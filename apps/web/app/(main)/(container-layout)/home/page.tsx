// External packages
import { dehydrate, InfiniteData, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';

// Components
import { Heading } from '@/components/ui/heading';
import { PostSkeleton } from '@/components/ui/post/post-skeleton';

// Types
import { retrieveHomePosts } from '@/lib/server/home';

// Modules
import { HomePostsMapping } from '@/modules/main/home/home-posts-mapping';
import { HomeSelect } from '@/modules/main/home/home-select';

export default async function HomePage({
	searchParams,
}: {
	searchParams?: Promise<{ filter?: string }>;
}) {
	const resolvedSearchParams = await searchParams;
	const filter =
		resolvedSearchParams?.filter === 'following'
			? ('following' as const)
			: undefined;
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading>Home</Heading>
				<HomeSelect />
			</div>
			<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
				<Suspense
					fallback={[...Array(6)].map((_, index) => (
						<PostSkeleton key={index} />
					))}
				>
					<Posts filter={filter} />
				</Suspense>
			</div>
		</>
	);
}

async function Posts({ filter }: { filter?: 'following' }) {
	const queryClient = new QueryClient();
	const limit = 6;
	const queryKey = ['home', 'posts', filter ?? null, limit] as const;
	type HomePostsPage = Awaited<ReturnType<typeof retrieveHomePosts>>;

	await queryClient.prefetchInfiniteQuery({
		queryKey,
		initialPageParam: 0,
		queryFn: async ({ pageParam }) => {
			const offset = (pageParam ?? 0) as number;
			return await retrieveHomePosts({
				filter,
				limit,
				offset,
			});
		},
		getNextPageParam: (lastPage: HomePostsPage, allPages: HomePostsPage[]) => {
			const loadedCount = allPages.reduce(
				(acc, page) =>
					acc + ((page as { posts?: unknown[] }).posts?.length ?? 0),
				0
			);
			const lastPostsLength =
				(lastPage as { posts?: unknown[] }).posts?.length ?? 0;
			if (lastPostsLength < limit) return undefined;
			return loadedCount;
		},
	});

	const dehydratedState = dehydrate(queryClient);
	const prefetched =
		queryClient.getQueryData<InfiniteData<HomePostsPage, number>>(queryKey);
	const firstPage = prefetched?.pages?.[0];

	return firstPage?.success ? (
		<HomePostsMapping dehydratedState={dehydratedState} />
	) : (
		<p className="text-muted-foreground text-center xl:col-span-2">
			Failed to load posts
		</p>
	);
}
