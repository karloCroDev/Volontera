// External packages
import * as React from 'react';
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

type HomeFeed = 'algo' | 'following';

const getNextOffset = (
	lastPage: RetrieveHomePostsResponse,
	allPages: RetrieveHomePostsResponse[],
	limit: number
) => {
	const loadedCount = allPages.reduce(
		(acc, page) => acc + (page.posts?.length ?? 0),
		0
	);

	if ((lastPage.posts?.length ?? 0) < limit) return undefined;
	return loadedCount;
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
			ReturnType<typeof homePostsQueryKey>,
			number
		>,
		'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
	>;
}) => {
	const query = useInfiniteQuery({
		queryKey: homePostsQueryKey({ feed, limit }),
		initialPageParam: 0,
		queryFn: ({ pageParam }) => {
			const offset = pageParam ?? 0;
			return feed === 'following'
				? retrieveRecentFollowedHomePosts({ limit, offset })
				: retrieveRecentAlgoHomePosts({ limit, offset });
		},
		getNextPageParam: (lastPage, allPages) =>
			getNextOffset(lastPage, allPages, limit),
		...options,
	});

	const posts = React.useMemo(
		() => query.data?.pages.flatMap((p) => p.posts) ?? [],
		[query.data]
	);

	return { ...query, posts };
};

export const homePostsQueryKey = ({
	feed,
	limit,
}: {
	feed: HomeFeed;
	limit: number;
}) => ['home-posts', feed, limit] as const;

export const useInfiniteAlgoHomePosts = (
	limit = 10,
	options?: Parameters<typeof useInfiniteHomePosts>[0]['options']
) => {
	return useInfiniteHomePosts({ feed: 'algo', limit, options });
};

export const useInfiniteFollowedHomePosts = (
	limit = 10,
	options?: Parameters<typeof useInfiniteHomePosts>[0]['options']
) => {
	return useInfiniteHomePosts({ feed: 'following', limit, options });
};
