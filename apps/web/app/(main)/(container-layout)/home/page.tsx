// Modules
import { Heading } from '@/components/ui/heading';
import { HomePostsMapping } from '@/modules/main/home/home-posts-mapping';
import { HomeSelect } from '@/modules/main/home/home-select';

// Lib
import { retrieveHomePosts } from '@/lib/server/home';

// Types
import { InfiniteData } from '@tanstack/react-query';
import { RetrieveHomePostsResponse } from '@repo/types/home';

export default async function HomePage({
	searchParams,
}: {
	searchParams?: Promise<{ filter?: string }>;
}) {
	const resolvedSearchParams = await searchParams;
	const filter =
		resolvedSearchParams?.filter === 'following' ? 'following' : undefined;

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

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading>Home</Heading>
				<HomeSelect />
			</div>
			<HomePostsMapping initialData={initialData} />
		</>
	);
}
