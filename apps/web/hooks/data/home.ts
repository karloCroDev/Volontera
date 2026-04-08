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

export const homeQueryKeys = {
	all: ['home'] as const,
	feed: (feed: RetrieveAlgoPostsSchemaArgs['filter'], limit: number) =>
		[...homeQueryKeys.all, 'posts', feed, limit] as const,
};

export const useInfiniteHomePosts = (
	data: RetrieveAlgoPostsSchemaArgs,
	options?: Omit<
		UseInfiniteQueryOptions<
			RetrieveHomePostsResponse,
			Error,
			InfiniteData<RetrieveHomePostsResponse>,
			ReturnType<typeof homeQueryKeys.feed>,
			string | null
		>,
		'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
	>
) => {
	const query = useInfiniteQuery({
		queryKey: homeQueryKeys.feed(data.filter, data.limit),
		initialPageParam: null,
		queryFn: ({ pageParam }) => {
			return retrieveRecentAlgoHomePosts({
				limit: data.limit,
				cursor: pageParam ?? undefined,
				filter: data.filter,
			});
		},
		getNextPageParam: (lastPage: RetrieveHomePostsResponse) =>
			lastPage.nextCursor ?? undefined,
		...options,
	});

	return query;
};
