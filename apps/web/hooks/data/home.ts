// External packages
import {
	useInfiniteQuery,
	UseInfiniteQueryOptions,
	InfiniteData,
} from '@tanstack/react-query';

// Lib
import {
	retrieveRecentAlgoHomePosts,
	retrieveRecentFollowedHomePosts,
} from '@/lib/data/home';

// Types
import { RetrieveHomePostsResponse } from '@repo/types/home';

//
export type HomeFeed = 'home' | 'following';

export const homeQueryKeys = {
	all: ['home'] as const,
	feed: (feed: HomeFeed, limit: number) =>
		[...homeQueryKeys.all, 'posts', feed, limit] as const,
};

export const useInfiniteHomePosts = ({
	feed,
	limit = 10,
	options,
}: {
	feed: HomeFeed;
	limit?: number;
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
		queryKey: homeQueryKeys.feed(feed, limit),
		initialPageParam: 0,
		queryFn: ({ pageParam }) => {
			const offset = pageParam ?? 0;
			return feed === 'following'
				? retrieveRecentFollowedHomePosts({ limit, offset })
				: retrieveRecentAlgoHomePosts({ limit, offset });
		},
		getNextPageParam: (
			lastPage: RetrieveHomePostsResponse,
			allPages: RetrieveHomePostsResponse[]
		) => {
			const loadedCount = allPages.reduce(
				(acc, page) => acc + (page.posts?.length ?? 0),
				0
			);

			if ((lastPage.posts?.length ?? 0) < limit) return undefined;
			return loadedCount;
		},
		...options,
	});

	return query;
};
