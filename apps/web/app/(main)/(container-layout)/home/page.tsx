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
		initialPageParam: null as string | null,
		queryFn: async ({ pageParam }) => {
			return await retrieveHomePosts({
				filter,
				limit,
				cursor: pageParam ?? undefined,
			});
		},
		getNextPageParam: (lastPage: HomePostsPage) =>
			'nextCursor' in lastPage ? (lastPage.nextCursor ?? undefined) : undefined,
	});

	const dehydratedState = dehydrate(queryClient);
	const prefetched =
		queryClient.getQueryData<InfiniteData<HomePostsPage, string | null>>(
			queryKey
		);

	return prefetched?.pages?.[0]?.success ? (
		<HomePostsMapping dehydratedState={dehydratedState} />
	) : (
		<p className="text-muted-foreground text-center xl:col-span-2">
			Failed to load posts
		</p>
	);
}
