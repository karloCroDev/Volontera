// External packages
import { InfiniteData } from '@tanstack/react-query';
import { Suspense } from 'react';

// Components
import { Heading } from '@/components/ui/heading';
import { PostSkeleton } from '@/components/ui/post/post-skeleton';

// Components
import { RetrieveHomePostsResponse } from '@repo/types/home';

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
	const initialPage = await retrieveHomePosts({
		filter,
		limit: 6,
		offset: 0,
	});

	const initialData:
		| InfiniteData<RetrieveHomePostsResponse, number>
		| undefined =
		initialPage && initialPage.success
			? { pages: [initialPage], pageParams: [0] }
			: undefined;

	return initialPage && initialPage.success ? (
		<HomePostsMapping initialData={initialData} />
	) : (
		<p className="text-muted-foreground text-center xl:col-span-2">
			Failed to load posts
		</p>
	);
}
