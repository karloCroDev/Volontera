// External packages
import {
	useInfiniteQuery,
	UseInfiniteQueryOptions,
	InfiniteData,
} from '@tanstack/react-query';

// Lib
import { retrieveRecentAlgoHomePosts } from '@/lib/data/home';

// Types
import { RetrieveHomePostsResponse } from '@repo/types/home';
import { RetrieveAlgoPostsSchemaArgs } from '@repo/schemas/home';

//

export const homeQueryKeys = {
	all: ['home'] as const,
	feed: (feed: RetrieveAlgoPostsSchemaArgs['filter'], limit: number) =>
		[...homeQueryKeys.all, 'posts', feed, limit] as const,
};

export const useInfiniteHomePosts = ({
	data,
	options,
}: {
	data: RetrieveAlgoPostsSchemaArgs;
	options?: Omit<
		UseInfiniteQueryOptions<
			RetrieveHomePostsResponse,
			Error,
			InfiniteData<RetrieveHomePostsResponse>,
			ReturnType<typeof homeQueryKeys.feed>,
			number
		>,
		'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
	>;
}) => {
	const query = useInfiniteQuery({
		queryKey: homeQueryKeys.feed(data.filter, data.limit),
		initialPageParam: 0,
		queryFn: ({ pageParam }) => {
			const offset = pageParam ?? 0;
			console.log('Fetching posts with filter:', data.filter);
			return retrieveRecentAlgoHomePosts({
				limit: data.limit,
				offset,
			});
		},
		getNextPageParam: (
			lastPage: RetrieveHomePostsResponse,
			allPages: RetrieveHomePostsResponse[]
		) => {
			const loadedCount = allPages.reduce(
				(acc, page) => acc + (page.posts?.length ?? 0),
				0
			);

			if ((lastPage.posts?.length ?? 0) < data.limit) return undefined;
			return loadedCount;
		},
		...options,
	});

	return query;
};
